# manager.go

https://github.com/google/syzkaller/blob/master/syz-manager/manager.go

<br/>

#### main 関数

- config ファイルの読み込み

```go=136
cfg, err := mgrconfig.LoadFile(*flagConfig)
```

- [RunManager](#runmanager-関数) の実行

```go=146
RunManager(cfg)
```

<br/>

#### RunManager 関数

- Manager 構造体の作成と設定
  - たぶんこれが syz-manager の実体
  - `make` は C言語の calloc 的な (ゼロで初期化されたメモリ確保)

```go=171
mgr := &Manager{ ... }
```

```go=194
mgr.initStats()
go mgr.preloadCorpus()
mgr.initHTTP() // Creates HTTP server.
mgr.collectUsedFiles()
go mgr.corpusInputHandler(corpusUpdates)
```

- RPCサーバの作成
  - RPC (Remote Procedure Call) : ネットワーク上で接続された他のコンピュータのプログラムを呼び出して実行させるための技術 

```go=201
mgr.serv, err = startRPCServer(mgr)
```

- [vmLoop](#vmloop-関数)

```go=255
mgr.vmLoop()
```

<br/>

#### vmLoop 関数

```go=301
func (mgr *Manager) vmLoop()
```