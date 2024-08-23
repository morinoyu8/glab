# pkg/rpcserver/rpcserver.go

https://github.com/google/syzkaller/blob/61405512146275a395ed4174f448ddc175f8c189/pkg/rpcserver/rpcserver.go

<br/>

## New

- [manager.go](../../../syz-manager/manager) の `RunManager()` : 272行目 から呼ばれている

```go=85
func New(cfg *mgrconfig.Config, mgr Manager, debug bool) (*Server, error)
```

- RPC サーバの実装

```go=102
newImpl(context.Background(), ...)
```

<br/>

## newImpl

```go=128
func newImpl(ctx context.Context, cfg *Config, mgr Manager) (*Server, error)
```

- VM との接続
- VM と接続するとそのたびに [serv.handleConn](#handleconn) が実行される

```go=159
s, err := flatrpc.ListenAndServe(cfg.RPC, serv.handleConn)
```

<br/>

## handleConn

- VM からの接続があるたびに呼ばれる

```go=172
func (serv *Server) handleConn(conn *flatrpc.Conn)
```

- runner は `mgr.fuzzerInstance()` ( [manager.go](../../../syz-manager/manager) : 315行目) で作成
- ほぼ runner = syz-executor と思って良さよう

```go=194
runner := serv.runners[id]
```
- 次の実行

```go=201
err = serv.handleRunnerConn(runner, conn)
```

<br/>

## handleRunnerConn

```go=206
func (serv *Server) handleRunnerConn(runner *Runner, conn *flatrpc.Conn) error
```

- RPC サーバと runner の双方の環境を確認し, 初期設定を行う
  - この内部で `serv.handleMachineInfo()` が実行される

```go=222
err := runner.Handshake(conn, opts) 
```

- runner とのコネクション部分
- この中で runner が syz-executor と通信する部分の `runner.ConnectionLoop()` が呼ばれる
  - `runner.ConnectionLoop()` の [詳細]()

```go=235
serv.connectionLoop(runner)
```

<br/>

## handleMachineInfo

- `serv.handleRunnerConn()` : 206行目の `runner.Handshake()` 内で呼ばれる

```go=238
func (serv *Server) handleMachineInfo(infoReq *flatrpc.InfoRequestRawT) (handshakeResult, error)
```

- ここでゲストカーネルでの環境を確認し, fuzzer のオブジェクトを作成している

```go=270
serv.runCheck(infoReq.Files, infoReq.Features)
```

<br/>

## runCheck

- この辺で VM の環境でどのシステムコールが使えるかを判断してそう

```go=320
enabledCalls, transitivelyDisabled := serv.target.TransitivelyEnabledCalls(enabledCalls)
```

- ここから fuzzer を作りそう
- `serv.mgr.MachineChecked` は関数ポインタ
- 基本的には `mgr.MachineChecked()`( [manager.go](../../../syz-manager/manager) : 1275行目)

```go=331
newSource := serv.mgr.MachineChecked(enabledFeatures, enabledCalls) 
```