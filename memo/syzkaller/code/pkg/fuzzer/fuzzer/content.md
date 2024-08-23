# pkg/rpcserver/rpcserver.go

https://github.com/google/syzkaller/blob/61405512146275a395ed4174f448ddc175f8c189/pkg/fuzzer/fuzzer.go

<br/>

## NewFuzzer

- [manager.go](../../../syz-manager/manager) の `MachineChecked()` : 1303行目 から呼ばれている
- syz-manager が実行された時一度のみ実行される

```go=41
func NewFuzzer(ctx context.Context, cfg *Config, rnd *rand.Rand, target *prog.Target) *Fuzzer
```

- これがプログラムの Queue
  - この中でプログラムの生成・変異を行う

```go=61
f.execQueues = newExecQueues(f)
```

- choice table の構築

```go=62
f.updateChoiceTable(nil)
```

- choice table を更新する manager

```go=63
go f.choiceTableUpdater() 
```

<br/>

## execQueues

```go=70
type execQueues struct {
	triageCandidateQueue *queue.DynamicOrderer
	candidateQueue       *queue.PlainQueue
	triageQueue          *queue.DynamicOrderer
	smashQueue           *queue.PlainQueue
	source               queue.Source
}
```

- プログラムのキュー
- `source.Next()` で次に実行すべきプログラムが返ってきそう

#### キューの優先度

1. triageCandidateQueue
   - candidate の中でトリアージする必要のあるものが入れられてそう
2. candidateQueue
   - syz-manager の実行時に元から存在するコーパスが入れられそう
   - 元々のコーパスがちゃんと実行できるのかを見ているのか?
3. triageQueue
   - トリアージでは新しいカバレッジを他の条件にかかわらず達成できるか・テストケースの最小化を行う
4. smashQueue
   - 新しいカバレッジを達成したシードを入れて, それらのテストケースを重点的に変異させてそう
   - 3回に1回は smash を飛ばす
5. 最後はランダムにシードを選んで生成・変異を行う

<br/>

## genFuzz

- execQueues の最後の5番目で, プログラムの生成・変異を行う

```go=224
func (fuzzer *Fuzzer) genFuzz() *queue.Request
```

- 95% (`mutationRate := 0.95`) の確率で変異させる

```go=234
if rnd.Float64() < mutateRate {
	req = mutateProgRequest(fuzzer, rnd)
}
```

- そうでなければ生成させる

```go=238
if req == nil {
	req = genProgRequest(fuzzer, rnd)
}
```