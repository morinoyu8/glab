# How to reproducing crashes

https://github.com/google/syzkaller/blob/master/docs/reproducing_crashes.md

<br/>

syzkaller のバグ再現プログラムを作成するプロセスは自動化されているが, 完全ではないので手動でプログラムを実行し, 再現するためのツールをいくつか提供している.

並列実行モードでは, クラッシュの原因となるプログラムがクラッシュの直前にあるとは限らない. クラッシュの原因となったプログラムを特定し, 最小化するのに役立つツール:

- `tools/syz-execprog`

  - 単一または複数のプログラムを様々なモード (ループ, threaded/collide mode, カバレッジ収集の有無 など) で実行する.
  - クラッシュログにあるプログラムをループで実行し, そのうち一つが実際にカーネルをクラッシュすることをチェックすることから始める.

    ```
    ./syz-execprog -executor=./syz-executor -repeat=0 -procs=16 -cover=0 crash-log
    ```

  - 次にクラッシュを引き起こす単一のプログラムを特定する.

    ```
    ./syz-execprog -executor=./syz-executor -repeat=0 -procs=16 -cover=0 file-with-a-single-program
    ```

  - クラッシュの原因となるプログラムが見つかったら, 個々のシステムコールを削除してみたり, 不要なデータを削除してみたり, 複数の mmap コールを一つにまとめてみたり, クラッシュを最小限で発生できるようにする. (手動かい)

- `tools/syz-prog2c`

  - クラッシュのプログラムに対して実行すると, 実行可能な Cプログラムが得られる.

これらのプロセスは `syz-repro` ユーティリティである程度自動化される.

```
./syz-repro -config my.cfg crash-qemu-1-1455745459265726910
```

これは問題のあるプログラムを見つけて最小化しようとする. 再現性に影響する要因はたくさんあるので, いつもうまくいくとは限らない.