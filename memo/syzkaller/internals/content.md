# How syzkaller works

## Overview

<img src="https://github.com/google/syzkaller/blob/master/docs/process_structure.png?raw=true" class="img-80" />

`syz-manager` は以下を担当する:

- VM インスタンスの起動・再起動・監視
- ファジングプロセス (生成・変異)
- 永続的なコーパスとクラッシュの保存

`syz-manager` は `syz-fuzzer` を生成する. `syz-fuzzer` は RPC を介して `syz-manager` と通信し、実行する必要があるプログラムを受け取り, 結果を返す.

`syz-fuzzer` はプログラム実行のため `syz-executor` プロセスを開始する.
  
各 `syz-executor` プロセスは一つの入力 (一連のシステムコール) を実行する.

## Syacall descriptions

`syz-fuzzer` は [システムコールの記述](../syscall-descriptions) に基づいて, `syz-executor` が実行するプログラムを生成する.