# Coverage

https://github.com/google/syzkaller/blob/master/docs/linux/coverage.md

<br/>

- syzkaller は [KCOV](https://www.kernel.org/doc/html/latest/dev-tools/kcov.html) を使ってカーネルからカバレッジを収集する. 
- kcov は実行された各基本ブロックのアドレスをエクスポートし, syzkaller ランタイムは `binutils` (`objdump`, `nm`, `addr2line`, `readelf`) を使用して, これらのアドレスをソースコード内の行や関数にマッピングする.

<br/>

## Binutils

### readelf

`readelf` は仮想メモリのオフセットを検出するために使用される

```
readelf -SW kernel_image
```

- `-S` : カーネルイメージファイルのセクションヘッダをリストアップ
- `-W` : 各セクションヘッダの項目を1行で出力

出力 :

```
There are 59 section headers, starting at offset 0x3825258:

Section Headers:
  [Nr] Name              Type            Address          Off    Size   ES Flg Lk Inf Al
  [ 0]                   NULL            0000000000000000 000000 000000 00      0   0  0
  [ 1] .text             PROGBITS        ffffffff81000000 200000 e010f7 00  AX  0   0 4096
  [ 2] .rela.text        RELA            0000000000000000 23ff488 684720 18   I 56   1  8
  [ 3] .rodata           PROGBITS        ffffffff82000000 1200000 2df790 00  WA  0   0 4096
  [ 4] .rela.rodata      RELA            0000000000000000 2a83ba8 0d8e28 18   I 56   3  8
  [ 5] .pci_fixup        PROGBITS        ffffffff822df790 14df790 003180 00   A  0   0 16
  [ 6] .rela.pci_fixup   RELA            0000000000000000 2b5c9d0 004a40 18   I 56   5  8
  [ 7] .tracedata        PROGBITS        ffffffff822e2910 14e2910 000078 00   A  0   0  1
  [ 8] .rela.tracedata   RELA            0000000000000000 2b61410 000120 18   I 56   7  8
  [ 9] __ksymtab         PROGBITS        ffffffff822e2988 14e2988 011b68 00   A  0   0  4
  [10] ...
```

- Executor は PC (program count?) を uint32 に切り捨てて `syz-manager` に送信し, `syz-manager` はセクションヘッダ情報を使ってオフセットを回復する. `
- Address` フィールドはセクションの仮想アドレスを表す. 上位32ビットはオフセットの回復に使われる.

<br/>

## Reporting coverage data

- `MakeReportGenerator` ファクトリーはレポート用のオブジェクトデータベースを作成する. 
  - ターゲットデータとソースファイル・ビルドディレクトリの場所の情報が必要
- このデータベースを構築する最初のステップはターゲットバイナリから関数データを抽出すること