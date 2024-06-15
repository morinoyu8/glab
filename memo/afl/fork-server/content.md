# Fuzzing random programs without execve()

https://lcamtuf.blogspot.com/2014/10/fuzzing-binaries-without-execve.html

<br/>

- データ解析ライブラリをファジングする最も一般的な方法は, 興味深い機能を実行する単純なバイナリを見つけ, それを繰り返し実行すること
- ライブラリのメモリ破壊バグのテストは, 子プロセスで `waitpid()` を実行し, `SIGSEGV`, `SIGABRT` などで終了するかチェックする

<br/>

- このアプローチが好まれる理由
  1. ドキュメントを読み込んで, 基礎となるライブラリが提供する API を理解し, パーサをストレステストするためのカスタムコードを書く必要がなくなる
  2. ファジングプロセスを反復的でロバストなものにする: プログラムは別プロセスで実行され, 入力ファイルごとに再起動されるため, ライブラリのランダムなメモリ破壊バグが, ファザー自体の状態を破壊したり, 後続の実行に副作用を及ぼす心配がない

<br/>

- このアプローチの問題点
  - `execve()`, リンカ, ライブラリの初期化を待つのにほとんどの時間を費やしてしまう
- AFL でオーバーヘッドを最小化する方法を考えたが, ほとんどのアイデアは複雑
  - カスタム ELF ローダを書き, ファザー自身が使用するメモリを一時的にロックし, プログラムをインプロセスで実行する
  - 1つの子プロセスで実行し, 子プロセスのメモリのスナップショットを作成し, `/proc/pid/mem` 経由で巻き戻す

<br/>

- もっとシンプルな解決策はファジングされたバイナリに小さなコードを注入すること
- これは, `LD_PRELOAD`, `PTRACE_POKETEXT`, コンパイル時の計装, ELFバイナリの書き換えによって実現可能
- 注入の目的は `execve()` を実行させ, リンカを通過させ, その後ファザーの処理の前にプログラムの早い段階で停止すること
- 最も単純な方法だと `main()` の前で停止することができる

<br/>

- プログラムが指定のポイントに達すると, ファザーからのコマンドを待つのみ
- ファザーから "go" のメッセージを受け取ると, `fork()` を呼び出して, クローンを作成する
  - コピーオンライトのおかげで, クローンは迅速に作成される
- 子プロセスでは, ファザーが提供した入力データを処理させる
- 親プロセスでは, 新しいプロセスの PID をファザーに伝え, コマンド待機ループに戻る

<br/>

- もちろん, Unix のプロセスセマンティクスを扱い始めると, 簡単なことではない
- 以下は, コードの中で回避しなければならなかったいくつかの問題 :

<br/>

<ul>

- ファイルディスクリプタは `fork()` で生成されたプロセス間で共有される
  - 開かれているディスクリプタは元の位置に巻き戻す必要があるかも
  - `main()` で停止するのであれば, ファザー自体で `lseek()` を実行することで stdin を巻き戻すことができる
  - しかし, さらに先を目指すなら, ハードルになる可能性がある

</ul>

<br/>

<ul>

- ファイルディスクリプタにも修正できないものがある
  - パイプ, キャラクタデバイス, ソケットのようなリセット不可能な I/O

</ul>

<br/>

<ul>

- スレッドを複製する作業はより複雑で, シムがそれら全てを追跡する必要がある
  - 単純な実装では, バイナリ内で追加のスレッドが生成される前にシムを注入する必要がある

</ul>

<br/>

<ul>

- ファザーはファジングされるプロセスの直接の親ではないので `waitpid()` を直接使用できない
  - プロセスの終了ステータスを通知するためのシンプルな API はない
  - シムが待機し, ステータスコードをファザーに送ることでこれを解決する
  - 他にもやり方色々あるけど大変そう

</ul>

<br/>

- シムは複雑ではなく, 動く部分もほとんどない
- ファイルディスクリプタ 198 のパイプ経由でコマンドを読み込み, 199 を使って親にメッセージを送る
- コードの要約は以下の通り

```
__afl_forkserver:

  /* Phone home and tell the parent that we're OK. */

  pushl $4          /* length    */
  pushl $__afl_temp /* data      */
  pushl $199        /* file desc */
  call  write
  addl  $12, %esp

__afl_fork_wait_loop:

  /* Wait for parent by reading from the pipe. This will block until
     the parent sends us something. Abort if read fails. */

  pushl $4          /* length    */
  pushl $__afl_temp /* data      */
  pushl $198        /* file desc */
  call  read
  addl  $12, %esp

  cmpl  $4, %eax
  jne   __afl_die

  /* Once woken up, create a clone of our process. */

  call fork

  cmpl $0, %eax
  jl   __afl_die
  je   __afl_fork_resume

  /* In parent process: write PID to pipe, then wait for child. 
     Parent will handle timeouts and SIGKILL the child as needed. */

  movl  %eax, __afl_fork_pid

  pushl $4              /* length    */
  pushl $__afl_fork_pid /* data      */
  pushl $199            /* file desc */
  call  write
  addl  $12, %esp

  pushl $2             /* WUNTRACED */
  pushl $__afl_temp    /* status    */
  pushl __afl_fork_pid /* PID       */
  call  waitpid
  addl  $12, %esp

  cmpl  $0, %eax
  jle   __afl_die

  /* Relay wait status to pipe, then loop back. */

  pushl $4          /* length    */
  pushl $__afl_temp /* data      */
  pushl $199        /* file desc */
  call  write
  addl  $12, %esp

  jmp __afl_fork_wait_loop

__afl_fork_resume:

  /* In child process: close fds, resume execution. */

  pushl $198
  call  close

  pushl $199
  call  close

  addl  $8, %esp
  ret
```

<br/>

- フォークサーバは価値のあること
- 多くの一般的なイメージライブラリのファジングを2倍以上高速化する
- `fork()` は遅いと評判のシステムコールなのに意外