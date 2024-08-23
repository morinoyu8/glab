# vm/dispatcher/pool.go

https://github.com/google/syzkaller/blob/61405512146275a395ed4174f448ddc175f8c189/vm/dispatcher/pool.go

<br/>

## Loop

- [manager.go](../../../syz-manager/manager) `RunManager()` の `mgr.pool.Loop(loopCtx)` (323行目) から呼ばれる

```go=60
func (p *Pool[T]) Loop(ctx context.Context)
```

- `p.runInstance(ctx, inst)` が立てる VM の数だけ実行される
  - この中で VM を作成し, syz-executor を実行する

```go=63
for _, inst := range p.instances {
    inst := inst
    go func() {
        for ctx.Err() == nil {
            p.runInstance(ctx, inst)
        }
        wg.Done()
    }()
}
```

<br/>

## runInstance

- VM 一つを作るために呼ばれる

```go=75
func (p *Pool[T]) runInstance(ctx context.Context, inst *poolInstance[T])
```

- ここで実際に VM を起動している
- 基本的に vm.go の `Create()` (151行目)
  - `p.creator` 自体は関数ポインタ

```go=86
obj, err := p.creator(inst.idx)
```

- runner を作成し, VM 内で syz-executor も実行する
  - この `job` は [manager.go](../../../syz-manager/manager) の `mgr.fuzzerInstance()` (688行目)

```go=113
job(ctx, obj, inst.updateInfo)
```