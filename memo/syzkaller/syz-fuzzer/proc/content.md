# proc.go

https://github.com/google/syzkaller/blob/master/syz-fuzzer/proc.go

<br/>

#### startProc 関数

```go=27
func startProc(tool *FuzzerTool, pid int, config *ipc.Config)
```
<br/>

```go=32
proc := &Proc{
    tool: tool,
    pid:  pid,
    env:  env,
}
go proc.loop()
```

- `Proc` 構造体を作成して `loop()` を実行

<br/>

#### loop 関数

```go=40
func (proc *Proc) loop()
```

- ひとつのプロセスで繰り返しプログラムを実行するっぽい
  - 無限 `for` ループ

<br/>

```go=42
req, wait := proc.nextRequest()
```

- `proc.tool.requests` から実行するプログラムを持ってくるっぽい
  - リクエストになければ色々してそう

<br/>

```go=53
for i := 1; i < int(req.Repeat) && res.Error == "" && req.Flags&flatrpc.RequestFlagIsBinary == 0; i++
```

- この `for` で指定された回数・エラーがなくなるまでプログラムを繰り返し実行してそう

<br/>

```go=77
err := flatrpc.Send(proc.tool.conn, msg)
```

- これで実行結果を RPC を通して, `syz-manager` に送ってそう