# 論文紹介

### A Path-Sensitively Sliced Control Flow Graph [FSE'14]

## 概要



## Introduction

- C プログラムから新しいグラフを構築

- Path-Sensitively Sliced Control Flow Graph (PSS-CFG) の特徴

  1. Path-sensitive である

        同じプログラムポイントを表す複数のノードが存在
   
  2. ターゲット変数に対してスライスされている

### Example

```c=
if (c)
    p = 1;
else
    p = 0;
x = 0;
if (p > 0)
    x = 1;
if (x == 0)
    z = 1;
target: {z}
```

これは以下のように変換できる. `z` の性質を知りたければ変換後のプログラムの方が効率的

```c=
if (!c)
    z = 1;
```

- (1行目) c のとき
  
  (2行目) `p = 1`

  (7行目) `x = 1`

  -> `z` の値は変化しない

- (1行目) !c のとき
  
  (4行目) `p = 0`

  (5行目) `x = 0`

  -> (9行目) `z = 1`

このように path-sensitive に考えるとスライシングが効果的に行える

<br/>

しかし、単純に path-sensitive に考えるとプログラムは元のサイズの指数倍

```c
if (c) p = 1; else p = 0;
S;
```
```c
if (c) { p = 1; S; } 
else { p = 0; S; } 
```

完全な path-sensitivity を確保することは困難なのでマージを行う

<br/>

**どのくらいマージする？**

この論文ではスライシングに影響する情報を残しつつ, マージを行った記号実行木 (Symbolic Execution Tree) を生成

それに対してスライシングを行うことで path-sensitive CFG を構築


## Basic Idea

アルゴリズム 2ステップ

1. 各頂点に target 変数の依存情報を付与した記号実行木の生成
   
   依存情報がより正確になるように path-sensitive に考える

   サイズの増加を防ぐため, 依存情報の精度を落とさないように頂点同士をマージ

2. Step1 の記号実行木のスライシングを行い, 最終的な PSS-CFG を生成


### Step1: 記号実行木の生成

<img src="images/image01.png" class="img-80" />

- 各ノードはあるパスを実行した時のプログラムポイント間の状態

- 深さ優先でグラフを構築

#### 各ノードが持つもの

Witness path と補間式はノードをマージするときに必要

- 依存集合 (Dependency set)

  Target 変数に影響を与える変数の集合

  スライシングで用いる

- Witness path

  そのノードから各依存変数が target 変数に影響を与えるまでのパス

  Witness 式 : Witness path を $\wedge$ で結合したもの 

  実行可能なパスの最終地点から逆向きに計算していく

- 補間式 (Interpolant)

  そのノードからの実行不可能なパスを通らないことを保証できる性質

  なるべく緩い条件を取ると別のノードからマージされやすくなる

  実行不可能なパスを見つけたら, そこから逆向きに計算していく

<img src="images/image04.png" class="img-80" />

#### ノードをマージするとき

ノード B を A にマージするとする

- A の補間式は A からの実行不可能なパスが満たさない性質

  - B がその性質を満たせば A からの実行不可能なパスを通ることがない

    -> B は A にマージ可能 (Soundness)

  - B が A からの実行不可能なパスを通る可能性があるなら, マージしてはいけない

  <img src="images/image02.png" class="img-100" />


- A の witness 式は A の各依存変数が target 変数に影響を与えるまでの条件

  - (A の各依存変数の witness 式) $\wedge$ (B までの性質) で充足不可能なものがある

    -> B から A にはない実行不可能なパスが存在する (精度の向上)

    <img src="images/image03.png" class="img-100" />


<br/>

[**Example**](slides/pss-cfg-1.pdf)

<br/>


### Step2: スライシング

Target 変数の最終的な値が変わらないように記号実行木をスライシング

<img src="images/image05.png" class="img-90" />

#### 3つの変換ルール

1. 代入文の左辺がそれ以降の依存集合に現れなければその文を削除

  <img src="images/image06.png" class="img-45" />

2. ある分岐点からの実行可能なパスが 1つしかないとき, その分岐文を削除

  <img src="images/image07.png" class="img-45" />

3. 分岐の "then", "else" 節両方に target 変数に影響を与える文がない かつ
  
   分岐の最終地点でノードがマージされているとき, 分岐全体を削除

   <img src="images/image08.png" class="img-55" />


## Algorithm

今まで見てきた手法を形式的に表す

### 事前準備

#### プログラム言語

ここで扱うプログラミング言語は簡単なもの

- 変数集合 $Var$ : 型はすべて整数

- 命令 (命令集合 $Ops$)

  - 代入 `x := e`

  - 仮定 `assume(c)` 

- プログラムの遷移 $~\ell \stackrel{\mathsf{op}}{\longrightarrow} \ell^{\prime}$  ( $\ell$ はプログラムポイント )

<details>
<summary>Example</summary>
<div class="details-inner">

```c=
y = 0;
if (x > 0)
    z = 1;
else
    z = 0;
w = 1;
```

```=
y := 0
assume(x > 0)
z := 1
assume(x <= 0)
z := 0
w := 1
```

$1 \stackrel{\mathsf{y\ :=\ 0}}{\longrightarrow} 2$

$2 \stackrel{\mathsf{assume(x > 0)}}{\longrightarrow} 3$

$3 \stackrel{\mathsf{z\ :=\ 1}}{\longrightarrow} 6$

$2 \stackrel{\mathsf{assume(x <= 0)}}{\longrightarrow} 5$

$5 \stackrel{\mathsf{z\ :=\ 0}}{\longrightarrow} 6$

$6 \stackrel{\mathsf{w\ :=\ 1}}{\longrightarrow} 7$

</div>
</details>

<br/>

#### シンボリック実行

##### シンボリック状態 

$$v : \langle\ell, s, \Pi\rangle$$

- $\ell$ : プログラムポイント

- $s$ : シンボリックストア : プログラム変数からシンボル変数への関数

  $s$ における式 $e$ の評価 $[e]_s$

  - 変数 $v$ : $<v _s = s(v)$

  - 整数 $n$ : $[n] _s = n$

  - $[e\ \mathsf{op}\ e']_s = [e]_s\ \mathsf{op}\ [e']_s$

- $\Pi$ : パス条件

<br/>

##### シンボリック実行

$v \equiv\langle\ell, s, \Pi\rangle$, $\ell \stackrel{\mathsf{op}}{\longrightarrow} \ell^{\prime}$ におけるシンボリック実行

$$v^{\prime} \triangleq \begin{cases}\left\langle\ell^{\prime}, s, \Pi \wedge [ c ] _s\right\rangle & \text { if op } \equiv \text { assume(c) }\ \text{ and }\  \Pi \wedge [ c ] _s \text { is satisfiable } \\ \left\langle\ell^{\prime}, s[x \mapsto [ e ] _s], \Pi\right\rangle & \text { if } \mathrm{op} \equiv \mathrm{x}:=\mathrm{e}\end{cases}$$

- パス条件に $c$ を追加

  $\Pi \wedge [ c ] _s$ が充足可能かどうかは制約ソルバーを用いる

- シンボリックストアに $x$ を追加

<br/>

##### 変数の条件とパス条件の結合

$$[v] : \left(\bigwedge_ {x \in \operatorname{Vars}} [x] _s\right) \wedge \Pi$$

<br/>

#### 記号実行木

シンボリック状態 $v \equiv\langle\ell, s, \Pi\rangle$ をノードとして, 以下の2つの情報を付加する

- 補間式 : $\overline{\Psi}$

- 依存変数と witness 式の組 : $\langle x, \omega_x\rangle$

<img src="images/image10.png" class="img-40" />

<br/>

#### 補間式

$A \wedge B$ が $false$ となる一階論理式 $A,\ B$ が与えられたとき, 補間式 $\overline{\Psi}$ は以下のように定義される

1. $A \models \overline{\Psi}$

2. $B \wedge \overline{\Psi}$ が $false$

3. $\overline{\Psi}$ の変数は $A, B$ の共通の変数

<details>
<summary>Example</summary>
<div class="details-inner">

ここで扱う補間式の性質:

そのノードから実行不可能なパスを通らないことを保証できる性質

<img src="images/image09.png" class="img-50" />

分岐直前のシンボリック状態 $v$ に対して

$$[v] : x = 1 \wedge y = 10 \wedge y > 5$$

$A : x = 1 \wedge y = 10 \wedge y > 5$, $\ B : y \leq 0\ $ としたとき

1. $x = 1 \wedge y = 10 \wedge y > 5 \models \overline{\Psi}$ 

2. $y \leq 0 \wedge \overline{\Psi}$ が $false$

3. $\overline{\Psi}$ の変数は $A, B$ の共通の変数

となる補間式 $\overline{\Psi}$ の一つは $y > 0$.

<br/>

この例での補間式 $\overline{\Psi}$ は $y > 1$ なども満たすが, $y > 0$ が最も良い.

別のシンボリック状態 $v'$ が $v$ に sound にマージできるということは $v'$ が $v$ からの実行不可能なパスを絶対に通らないということ.

$$ [v'] \models \overline{\Psi}_s $$

よって $\overline{\Psi}_s$ の条件が緩い方がマージされる可能性が高くなる.

</div>
</details>

<br/>

#### 依存変数

依存集合 : $\sigma _v$

- プログラムの最終地点における $\sigma _v$ : Target 変数の集合 $\mathcal{V}$

- Backward に依存集合を更新

  $v \stackrel{\mathsf{op}}{\longrightarrow} v^{\prime}$ とする

  - $\mathsf{op} \equiv \mathsf{x := e}$ のとき

    - $\mathsf{x}$ が $\sigma_{v'}$ に含まれる ($\ \sigma_{v'} \cap def(\mathsf{op}) \neq \emptyset\ $) のとき

$$\sigma_v\ \triangleq\ \left(\sigma_{v^{\prime}} \backslash def(\mathsf{op})\right) \cup use(\mathsf{op})$$

<ul>
<ul>
<ul>

この条件を満たして依存変数が更新されたとき, $\ v \stackrel{\mathsf{op}}{\longrightarrow} v^{\prime}$ が "スライスに含まれる" と言う

</ul>
</ul>
</ul>

<ul>
<ul>

- それ以外のとき

$$\sigma_v\ \triangleq\ \sigma_{v'}$$

</ul>

- $\mathsf{op} \equiv \mathsf{assume}(c)$ のとき

  - この命令から分岐の合流地点までの命令のいずれかがスライスに含まれるとき

$$\sigma_v\ \triangleq\ \sigma_{v^{\prime}} \cup u s e(\mathsf{op})$$

<ul>
<ul>

この条件を満たして依存変数が更新されたとき, $\ v \stackrel{\mathsf{op}}{\longrightarrow} v^{\prime}$ が "スライスに含まれる" と言う

</ul>

- それ以外のとき

$$\sigma_v\ \triangleq\ \sigma_{v'}$$

</ul>
</ul>

<details>
<summary>Example</summary>
<div class="details-inner">

$v \stackrel{\mathsf{op}}{\longrightarrow} v^{\prime}$, $\mathsf{op} \equiv \mathsf{x := y + z}$ 

$x \in \sigma _{v'}$ のとき

$$\sigma_v = \left(\sigma_{v^{\prime}} \backslash \{x\} \right) \cup \{ y, z \}$$

</div>
</details>

<br/>

#### 依存変数と witness 式

Target 変数の集合 : $\mathcal{V}$

シンボリック状態 $v$ の依存変数 $x \in \sigma_v$ が $\mathcal{V}$ の変数に影響を与えるまでのパス 

$$\pi \equiv v \dots v_{end}$$ 

を witness path とする. 

witness 式 $\ \omega_x$ : パス $\pi$ について変数とパスの条件を結合したもの

<br/>

依存変数と witness 式の組を考える

抽象ドメイン : $\ \ \mathcal{D} \triangleq\{\perp\} \cup \mathcal{P}(Vars \times FOL)$


これ以降は依存変数と witness 式の組の集合を $\sigma$ で表す


<br/>

#### マージ

シンボリック状態 : $v \equiv \langle\ell, s, \Pi\rangle$ 

すでに計算された状態 :  $v' \equiv \langle\ell, s', \Pi'\rangle$ 

$\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ $ 補間式 : $ \overline{\Psi}_{v'} $ 

$\ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ \ $ 依存変数と witness 式の組の集合 : $ \sigma_{v'} $

<br/>

次の条件を満たすとき $v$ は $v'$ にマージできる

1. $[v] \models \overline{\Psi}_{v'}$

2. $\forall \langle x, \cdot \rangle \in \sigma_{v'},\ \exists \langle x, \omega_x \rangle \in \sigma_{v'}\ \ s.t\ \  [v] \wedge \omega_x \ $ が充足可能


##### 1つ目の条件

$$[v] \models \overline{\Psi}_{v'}$$

$v$ の条件は補間式 $\overline{\Psi}_{v'}$ を満たす

$v'$ からのパスは $v$ から実行不可能なパスを絶対に通らない (soundness)

<br/>

**補題 1 :**

<ul>

$[v] \models \overline{\Psi}_{v'}$ が成り立つとき, $v$ からの実行可能なパスの集合は $v'$ からの実行可能なパスの集合の 部分集合 である

</ul>

<details>
<summary>背理法による証明</summary>
<div class="details-inner">

$v$ から実行可能で $v'$ から実行不可能なパス条件 $\Pi$ のパス $\pi$ が存在すると仮定する.

- $\pi$ は $v'$ から実行不可能だから, $[v'] \wedge \Pi$ は充足不可能

- 補間式の定義から $\overline{\Psi}_{v'} \wedge \Pi$ は充足不可能

- これと $[v] \models \overline{\Psi}_{v'}$ から, $[v] \wedge \Pi$ は充足不可能

これは $\pi$ が $v$ から実行可能であることに矛盾.

</div>
</details>

<br/>

##### 2つ目の条件

<br/>

<div style="text-align:center;">

$\forall \langle x, \cdot \rangle \in \sigma_{v'},\ \exists \langle x, \omega_x \rangle \in \sigma_{v'}\ \ s.t\ \  [v] \wedge \omega_x \ $ が充足可能

</div>

<br/>

<ul>

$v'$ のすべての依存変数について $[v] \wedge \omega_x$ が充足可能となる witness 式が存在する

  $v$ の中には

</ul>