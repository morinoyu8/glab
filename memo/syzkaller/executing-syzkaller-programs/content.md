# Executiong syzkaller programs

https://github.com/google/syzkaller/blob/master/docs/executing_syzkaller_programs.md

<br/>

バグ再現のために既存の syzkaller プログラムを実行する方法. 一つのプログラムまたは複数のプログラムを含む実行ログを再度実行できる.

1. Go ツールチェーンの設定

```
export GOROOT=$HOME/goroot
export GOPATH=$HOME/gopath
```

2. syzkaller のダウンロード

```
git clone https://github.com/google/syzkaller
```

3. syzkaller のビルド

```
cd syzkaller
make
```

4. バイナリとプログラムをテスト環境にコピー

```
scp -P 10022 -i bullseye.img.key bin/linux_amd64/syz-execprog bin/linux_amd64/syz-executor program root@localhost:
```

5. テスト環境でプログラムの実行

```
./syz-execprog -repeat=0 -procs=8 program
```

`syz-execprog` のフラグ

```
-procs int
    number of parallel processes to execute programs (default 1)
-repeat int
    repeat execution that many times (0 for infinite loop) (default 1)
-sandbox string
    sandbox for fuzzing (none/setuid/namespace) (default "setuid")
-threaded
    use threaded mode in executor (default true)
```

- `-threaded=0` : プログラムはシングルスレッドで実行される
- `-threaded=1` : 各システムコールを別々のスレッドで実行