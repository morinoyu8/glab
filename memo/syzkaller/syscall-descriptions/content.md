# Syscall descriptions

https://github.com/google/syzkaller/blob/master/docs/syscall_descriptions.md

<br/>

syzkaller はシステムコールインターフェースの記述を使って, プログラム (システムコールのシーケンス) を操作する.

例:

```
open(file filename, flags flags[open_flags], mode flags[open_mode]) fd
read(fd fd, buf buffer[out], count len[buf])
close(fd fd)
open_mode = S_IRUSR, S_IWUSR, S_IXUSR, S_IRGRP, S_IWGRP, S_IXGRP, S_IROTH, S_IWOTH, S_IXOTH
```

記述は `sys/$OS/*.txt` 内にある. 

[詳細](https://github.com/google/syzkaller/blob/master/docs/syscall_descriptions_syntax.md)

## Programs

記述はプログラムの生成・変異・実行・最小化・シリアライズ (結合？)・デシリアライズに用いられる.
プログラムは引数に具体的な値を持つシステムコールのシーケンス.

例:

```
r0 = open(&(0x7f0000000000)="./file0", 0x3, 0x9)
read(r0, &(0x7f0000000000), 42)
close(r0)
```

syzkaller は [prog/prog.go](https://github.com/google/syzkaller/blob/master/prog/prog.go) で定義された `Call` と `Arg` からなる in-memory AST-like な表現(?) を使用する.

現在すべてのシステムコールの記述は手作業で書かれている.

