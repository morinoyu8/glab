# How syzkaller works

https://github.com/google/syzkaller/blob/master/docs/internals.md

## Overview

<img src="https://github.com/google/syzkaller/blob/master/docs/process_structure.png?raw=true" class="img-80" />

- `syz-manager` は以下を担当する:

  - VM インスタンスの起動・再起動・監視
  - ファジングプロセス (生成・変異)
  - 永続的なコーパスとクラッシュの保存

- `syz-manager` は `syz-fuzzer` を生成する. `syz-fuzzer` は RPC を介して `syz-manager` と通信し、実行する必要があるプログラムを受け取り, 結果を返す.

- `syz-fuzzer` はプログラム実行のため `syz-executor` プロセスを開始する.
  
- 各 `syz-executor` プロセスは一つの入力 (一連のシステムコール) を実行する.

## Syacall descriptions

`syz-fuzzer` は [システムコールの記述](../syscall-descriptions) に基づいて, `syz-executor` が実行するプログラムを生成する.

## Coverage

syzkaller はカバレッジガイドファザーである. カバレッジ収集の詳細は[こちら](../coverage).

## Crash Reports

syzkaller はクラッシュが発生すると, その情報を `workdir/crashes` ディレクトリに保存する. 下みたいなフォルダ構成.

```
 - crashes/
   - 6e512290efa36515a7a27e53623304d20d1c3e
     - description
     - log0
     - report0
     - log1
     - report1
     ...
   - 77c578906abe311d06227b9dc3bffa4c52676f
     - description
     - log0
     - report0
     ...
```

- `logN` ファイル
  - 生の syzkaller ログを含み, クラッシュ前に実行されたプログラムとカーネルコンソール出力を含む. これらのログは [クラッシュ位置と最小化](../reproducing-crashes/) のための `syz-repro` に与えたり, [手動でローカライズする](../executing-syzkaller-programs/) ために `syz-execprog` ツールに供給したりする.