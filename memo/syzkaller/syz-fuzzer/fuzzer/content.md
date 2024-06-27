# fuzzer.go

https://github.com/google/syzkaller/blob/master/syz-fuzzer/fuzzer.go

<br/>

#### main 関数

```go=48
func main()
```

- `syz-fuzzer` の起動時に一度だけ呼ばれる

<br/>

```go=103
err := flatrpc.Send(conn, connectReq)
```

- `syz-manager` の RPC サーバに対して接続のリクエストを送ってそう

<br/>

```go=106
flatrpc.Recv[]()
```

- これで `syz-manager` からのメッセージを受け取ってそう

<br/>

```go=158
for pid := 0; pid < int(connectReply.Procs); pid++ {
	startProc(fuzzerTool, pid, config)
}
```

- 指定された数だけ `startProc()` が実行される
  - つまり一つの VM 内の `syz-executor` の数?
- [proc.go](../proc/) の中に `startProc()` がある
  - この中でプログラムが実行される

<br/>

```go=162
fuzzerTool.handleConn()
```

- RPC を通して `syz-manager` と永遠と通信する

<br/>

#### handleConn 関数

```go=220
func (tool *FuzzerTool) handleConn()
```

- RPC を通して `syz-manager` と永遠と通信する
  - 無限 `for` ループ

<br/>

```go=222
raw, err := flatrpc.Recv[flatrpc.HostMessageRaw](tool.conn)
```

- `syz-maneger` からのメッセージを受け取る

<br/>

```go=227
case *flatrpc.ExecRequest:
	msg.ProgData = slices.Clone(msg.ProgData)
	tool.requests <- msg
```

- 受け取ったプログラム (システムコールの列) を `FuzzerTool.requests` に入れてそう
