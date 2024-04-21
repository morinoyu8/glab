# proc.go

https://github.com/google/syzkaller/blob/master/syz-fuzzer/proc.go

(syz-executor の部分)

<br/>

#### newProc 関数

```go=24
func newProc(tool *FuzzerTool, execOpts *ipc.ExecOpts, pid int) (*Proc, error)
```

- `Proc` 構造体を作成 (コンストラクタ的な)

```go=29
proc := &Proc{
    tool:     tool,
    pid:      pid,
    env:      env,
    execOpts: execOpts,
}
return proc, nil
```

<br/>

#### loop 関数

- ひとつのプロセスで繰り返しプログラムを実行するっぽい

```go=38
func (proc *Proc) loop()
```

- たぶん次のプログラムが返ってくる

```go=41
req := proc.nextRequest()
```

- プログラムの実行?

```go=62
info, try := proc.execute(&opts, req.ID, req.ProgData)
```

<br/>

#### execute 関数

```go=89
func (proc *Proc) execute(opts *ipc.ExecOpts, progID int64, progData []byte) (*ipc.ProgInfo, int)
```

- たぶんこれで実行するはず

```go=101
output, info, hanged, err = proc.env.ExecProg(opts, progData)
```

<br/>

## pkg/ipc/ipc.go

https://github.com/google/syzkaller/blob/master/pkg/ipc/ipc.go

#### ExecProg 関数

```go=253
func (env *Env) ExecProg(opts *ExecOpts, progData []byte) (output []byte, info *ProgInfo, hanged bool, err0 error)
```

Exec starts executor binary to execute program stored in progData in exec encoding and returns information about the execution.

- プログラムの実行っぽい

```go=276
output, hanged, err0 = env.cmd.exec(opts, progData)
```