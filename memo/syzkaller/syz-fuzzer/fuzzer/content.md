# fuzzer.go

https://github.com/google/syzkaller/blob/master/syz-fuzzer/fuzzer.go

<br/>

#### main 関数

```go=100
func main()
```

- `flagProcs` の数だけプロセスを作成 (`Proc` 構造体の新規作成)
- `proc.loop()` を並列に実行
  - [proc.go](../proc/)

```go=243
for pid := 0; pid < *flagProcs; pid++ {
    proc, err := newProc(fuzzerTool, execOpts, pid)
    if err != nil {
        log.SyzFatalf("failed to create proc: %v", err)
    }
    fuzzerTool.procs = append(fuzzerTool.procs, proc)
    go proc.loop()
}
```