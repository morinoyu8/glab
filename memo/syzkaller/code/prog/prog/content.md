# prog.go

https://github.com/google/syzkaller/blob/master/prog/prog.go

<br/>

#### Prog 構造体

- これがシステムコールの列
  - ファザーの入力

```go=11
type Prog struct {
	Target   *Target
	Calls    []*Call
	Comments []string

	// Was deserialized using Unsafe mode, so can do unsafe things.
	isUnsafe bool
}
```

- `Target`: OS とかアーキテクチャとかの情報 ( [taget.go](https://github.com/google/syzkaller/blob/master/prog/target.go) )
- `Calls`: システムコール (のメタ情報) の列
- `Comments`: コメント?

#### Call 構造体

```go=40
type Call struct {
	Meta    *Syscall
	Args    []Arg
	Ret     *ResultArg
	Props   CallProps
	Comment string
}
```

- `Meta`: システムコールのメタ情報
- `Args`: 引数
- `Ret`: 返り値
- `Props`: ??


#### Arg 

- 全部 `Arg` インターフェースの実装
- 何が何の `Type` なのかは要調査

```go=81
// Used for ConstType, IntType, FlagsType, LenType, ProcType and CsumType.
type ConstArg struct
```

```go=122
// Used for PtrType and VmaType.
type PointerArg struct 
```

```go=180
// Used for BufferType.
type DataArg struct
```

```go=221
// Used for StructType and ArrayType.
// Logical group of args (struct or array).
type GroupArg struct
```

```go=278
// Used for UnionType.
type UnionArg struct
```

```go=300
// Used for ResourceType.
// This is the only argument that can be used as syscall return value.
// Either holds constant value or reference another ResultArg.
type ResultArg struct
```

- `Make...Arg` で新しい `Arg` を生成する

#### insertBofore メソッド

```go=351
func (p *Prog) insertBefore(c *Call, calls []*Call)
```

- `p` のシステムコールの列で, `c` の前に `calls` を挿入する

#### replaceArg メソッド

```go=369
// replaceArg replaces arg with arg1 in a program.
func replaceArg(arg, arg1 Arg)
```

- `arg` を `arg1` で置き換える
- ポインタで中身を置き換えてる

#### RemoveArg メソッド

```go=456
// RemoveArg is the public alias for the removeArg method.
func RemoveArg(arg Arg)
```

- `arg0` を消す

#### RemoveCall メソッド

```go=461
// RemoveCall removes call idx from p.
func (p *Prog) RemoveCall(idx int)
```

- `idx` のシステムコールを削除