# Model Checking

### Ch.7 : Automata on Infinite Words and LTL Model Checking

## 概要

- 6章 : タブローを用いた LTL 式の検査

- 7章 : オートマトンを用いた LTL 式の検査

  - システムも性質もオートマトンで表す

### オートマトンを用いた LTL 式検査の概要

<img src="images/image7-0-1.png" class="img-100" />

1. システムのオートマトンを構築
2. 満たしたくない性質 (LTL 式の否定) のオートマトンを構築
3. 1 と 2 のオートマトンを合成
4. 3 のオートマトンの受理言語をチェック
   - 受理言語が空: システムは LTL 式を満たす (満たしたくない性質の実行が存在しない)
   - 受理言語が空でない: システムは LTL 式を満たさない (満たしたくない性質の実行が存在する)

### クリプキ構造 ・ LTL 式とオートマトンの関係

#### クリプキ構造

<img src="images/image7-0-8.png" class="img-60" />

- クリプキ構造上の状態のラベルをそれに向かう辺のラベルに

- システムの状態遷移から得られるラベルの列がオートマトンの受理言語

  - $s_0s_1s_0s_1s_2s_0$ : $\{p,q\}\{p\}\{p,q\}\{p\}\{q\}\{p,q\}$

#### LTL 式

[**Slide**](slides/ltl-automaton.pdf)

<img src="images/image7-0-7-3.png" class="img-70" />

- オートマトンの状態はパスのある状態からの性質を表す

- LTL 式のオートマトンが受理する言語はある LTL パスの状態のラベルの列

  - $\{ p \}\{ p \}\{ q \}...$

### 考えること

- オートマトンについて

  - [7.1 節](#71-finite-automata-on-finite-words) : 有限の文字列を扱える有限オートマトン
  - [7.2 節](#72-automata-on-infinite-words) : 無限の文字列を扱える有限オートマトン (Büchi オートマトン)
  - 7.3 節 : 決定性・非決定性 Büchi オートマトン
  - 7.6 節 : 一般的な Büchi オートマトン について

- オートマトンの合成について

  <img src="images/image7-0-2.png" class="img-100" />

  - 7.4 節 : Büchi オートマトンの積

<br/>

- オートマトンが空かどうかのチェック

  <img src="images/image7-0-3.png" class="img-100" />

  - 7.5 節 : オートマトンが空かどうかのチェック

<br/>

- クリプキ構造からオートマトンへの変換

  <img src="images/image7-0-4.png" class="img-100" />

  - 7.7 節 : オートマトンとクリプキ構造

<br/>

- オートマトンを用いた LTL 式検査の概要

  <img src="images/image7-0-1.png" class="img-100" />

  - 7.8 節 : オートマトンを用いたモデル検査

<br/>

- LTL 式からオートマトンへの変換

  <img src="images/image7-0-5.png" class="img-100" />

  - 7.9 節 : ナイーブな変換方法
  - 7.10 節 : 効率的な変換方法

<br/>

## 7.1 Finite Automata on Finite Words

- regular automata : **有限** の文字列を扱える有限オートマトン
- $\omega$-regular automata : **無限** の文字列を扱える有限オートマトン

有限の文字列を扱える有限オートマトン $\mathcal{A}$ : $(\Sigma, \mathcal{Q}, \Delta, \mathcal{Q}^0, F)$

- $\Sigma$ : 有限のアルファベット  
  - $\{a, b\}$

- $\mathcal{Q}$ : 状態の有限集合
  - $\{q_1, q_2\}$

- $\Delta \subseteq \mathcal{Q} \times \Sigma \times \mathcal{Q}$ : 遷移関係
  - $\{(q_1, a, q_1), (q_1, b, q_2), (q_2, a, q_1), (q_2, b, q_2)\}$

- $\mathcal{Q}^0 \subseteq \mathcal{Q}$ : 初期状態の集合

- $F \subseteq \mathcal{Q}$ : 受理状態 (accepting states) の集合

<details>
<summary><dev style="color: var(--main-color)">Example</dev></summary>
<div class="details-inner">

<img src="images/image7-1-2.png" class="img-40" />

$(\Sigma, \mathcal{Q}, \Delta, \mathcal{Q}^0, F)$

- $\Sigma = \{a, b\}$

- $\mathcal{Q} = \{q_1, q_2\}$

- $\Delta = \{(q_1, a, q_1), (q_1, b, q_2), (q_2, a, q_1), (q_2, b, q_2)\}$

- $\mathcal{Q}^0 = \{ q_1 \}$

- $F = \{ q_1 \}$

</div>
</details>

<br/>

$v \in \Sigma^{*}$ : 文字列 (word, string, sequence)

$v$ を得るための $\mathcal{A}$ の実行 (run) $\rho$

$$\rho : \{ 1, \cdots, |v| + 1 \} \mapsto \mathcal{Q}$$

- $\rho(1) \in \mathcal{Q}^0$
- $v$ の $i$ 文字目を $v(i)$ としたとき, $\ 1 \leq i \leq |v|,\ (\rho(i), v(i), \rho(i + 1)) \in \Sigma$ (遷移関係)

$\rho(|v| + 1) \in F$ (最終状態) のとき実行 $\rho$ は **受理される** 

$\mathcal{A}$ が文字列 $v$ を **受理する** (**accept**) : $v$ を得られる実行 $\rho$ が受理される

(オートマトンを初期状態から遷移に沿って移動, 最後は受理状態のとき出来上がる文字列は受理される)

<br/>

<details>
<summary><dev style="color: var(--main-color)">Example</dev></summary>
<div class="details-inner">

<img src="images/image7-1-2.png" class="img-40" />

文字列 $abba$ が得られる実行は？ : $q_1q_1q_2q_2q_1$

文字列 $baa$ が得られる実行は？
<details>
<summary>答え</summary>
<div class="details-inner">

$q_1q_2q_1q_1$

</div>
</details>

文字列 $bbaba$ は受理される？

<details>
<summary>答え</summary>
<div class="details-inner">

Yes

受理される実行 $q_1q_2q_2q_1q_2q_1$ が存在する

</div>
</details>

文字列 $aabab$ は受理される？

<details>
<summary>答え</summary>
<div class="details-inner">

No

受理される実行が存在しない

($aabab$ が得られる実行 $q_1q_1q_1q_2q_1q_2$ は最後の状態が受理状態 $F$ に含まれない)

</div>
</details>

</div>
</details>

<br/>

$\mathcal{A}$ の言語 (language) $\mathcal{L}(\mathcal{A}) \subseteq \Sigma^{*}$ : $\mathcal{A}$ によって受理されるすべての文字列

<br/>

<details>
<summary><dev style="color: var(--main-color)">Example</dev></summary>
<div class="details-inner">

<img src="images/image7-1-2.png" class="img-40" />

$\mathcal{A}$ の言語 : $\varepsilon + (a + b)^{*}a$

</div>
</details>

<br/>

### 7.1.1 Determinization and Complementation

<img src="images/image7-1-1.png" class="img-70" />

非決定性 (nondeterministic) オートマトン : ある状態から同じ文字でラベル付けされた複数の状態への遷移が存在する 

$$ (q, a, l), (q, a, l') \in \Delta , \text{where}\ l \neq l'$$

決定性 (deterministic) オートマトン : 上記の遷移が存在しない かつ 初期状態が一つ $|\mathcal{Q}^0| = 1$

非決定性 regular オートマトンは受理言語を変えずに決定性オートマトンに変換できる

<br/>

非決定性オートマトン : $\mathcal{A} = (\Sigma, \mathcal{Q}, \Delta, \mathcal{Q}^0, F)$ は以下の決定性オートマトンに変換可能

$$\mathcal{A}' = (\Sigma, \mathcal{P}(\mathcal{Q}), \Delta', \{\mathcal{Q}^0\}, F')$$

- 遷移関係 $\Delta' \subseteq \mathcal{P}(\mathcal{Q}) \times \Sigma \times \mathcal{P}(\mathcal{Q})$

  - $(\mathcal{Q}_1, a, \mathcal{Q}_2) \in \Delta'$ if

  $$Q_2 = \displaystyle \bigcup_{q \in Q_1} \{ q' \ | \ (q,a,q') \in \Delta \}$$

  - $\mathcal{A'}$ は決定性なので, $\Delta'$ は関数 $\mathcal{P}(\mathcal{Q}) \times \Sigma \to \mathcal{P}(\mathcal{Q})$ で表される

- 受理状態の集合 $F'$ : $\{ Q'\ |\ Q' \cap F \neq \emptyset \}$


<br/>

<details>
<summary><dev style="color: var(--main-color)">Example</dev></summary>
<div class="details-inner">

非決定性オートマトンから決定性オートマトンへの変換

<img src="images/image7-1-3.png" class="img-55" />

非決定性オートマトン $\mathcal{A}$ : $(\Sigma, \mathcal{Q}, \Delta, \mathcal{Q}^0, F)$

- $\Sigma = \{a, b, c\}$

- $\mathcal{Q} = \{q_1, q_2, q_3\}$

- $\Delta = \{(q_1, b, q_1), (q_1, c, q_2), (q_2, b, q_1), (q_2, c, q_3), (q_3, a, q_2), (q_3, a, q_3)\}$

- $\mathcal{Q}^0 = \{ q_1, q_2 \}$

- $F = \{ q_1, q_3 \}$

決定性オートマトン $\mathcal{A}' = (\Sigma, \mathcal{P}(\mathcal{Q}), \Delta', \{\mathcal{Q}^0\}, F')$ に変換する

- 初期状態 : $\{ \{ q_1, q_2 \} \}$

- 遷移関係 $\Delta'$ :


  |  | $a$ | $b$ | $c$ |
  | ---: | :---: | :---: | :---: |
  | $\emptyset$ | $\emptyset$ | $\emptyset$ | $\emptyset$ |
  | $\{ q_1 \}$ | $\emptyset$ | $\{ q_1 \}$ | $\{ q_2 \}$ |
  | $\{ q_2 \}$ | $\emptyset$ | $\{ q_1 \}$ | $\{ q_3 \}$ |
  | $\{ q_3 \}$ | $\{ q_2, q_3 \}$ | $\emptyset$ | $\emptyset$ |
  | $\{ q_1, q_2 \}$ | $\emptyset$ | $\{ q_1 \}$ | ? |
  | $\{ q_1, q_3 \}$ | $\{ q_2, q_3 \}$ | $\{ q_1 \}$ | $\{ q_2 \}$ |
  | $\{ q_2, q_3 \}$ | $\{ q_2, q_3 \}$ | $\{ q_1 \}$ | $\{ q_3 \}$ |
  | $\{ q_1, q_2, q_3 \}$ | $\{ q_2, q_3 \}$ | $\{ q_1 \}$ | $\{ q_2, q_3 \}$ |


    <details>
    <summary>答え</summary>
    <div class="details-inner">

    |  | $a$ | $b$ | $c$ |
    | ---: | :---: | :---: | :---: |
    | $\emptyset$ | $\emptyset$ | $\emptyset$ | $\emptyset$ |
    | $\{ q_1 \}$ | $\emptyset$ | $\{ q_1 \}$ | $\{ q_2 \}$ |
    | $\{ q_2 \}$ | $\emptyset$ | $\{ q_1 \}$ | $\{ q_3 \}$ |
    | $\{ q_3 \}$ | $\{ q_2, q_3 \}$ | $\emptyset$ | $\emptyset$ |
    | $\{ q_1, q_2 \}$ | $\emptyset$ | $\{ q_1 \}$ | $\{ q_2, q_3 \}$ |
    | $\{ q_1, q_3 \}$ | $\{ q_2, q_3 \}$ | $\{ q_1 \}$ | $\{ q_2 \}$ |
    | $\{ q_2, q_3 \}$ | $\{ q_2, q_3 \}$ | $\{ q_1 \}$ | $\{ q_3 \}$ |
    | $\{ q_1, q_2, q_3 \}$ | $\{ q_2, q_3 \}$ | $\{ q_1 \}$ | $\{ q_2, q_3 \}$ |
    
    </div>
    </details>

- 受理状態 $F'$ : $\{ \{ q_1 \}, \{ q_3 \}, \{ q_1, q_2 \}, \{ q_1, q_3 \}, \{ q_2, q_3 \}, \{ q_1, q_2, q_3 \} \}$


  <!-- - $( \{ q_1, q_2 \}, b, \{ q_1 \} )$
  - $( \{ q_1, q_2 \}, c, ? )$

    <details>
    <summary>答え</summary>
    <div class="details-inner">
    $( \{ q_1, q_2 \}, c, \{ q_2, q_3 \} )$
    </div>
    </details>

  - $( \{ q_1 \}, b, \{ q_1 \} )$
  - $( \{ q_1 \}, c, \{ q_2 \} )$
  - $( \{ q_2 \}, b, \{ q_1 \} )$
  - $( \{ q_2 \}, c, \{ q_3 \} )$
  - $( \{ q_3 \}, a, ? )$

    <details>
    <summary>答え</summary>
    <div class="details-inner">
    $( \{ q_3 \}, a, \{ q_2, q_3 \} )$
    </div>
    </details>

  - $( \{ q_2, q_3 \}, a, ? )$

    <details>
    <summary>答え</summary>
    <div class="details-inner">
    $( \{ q_2, q_3 \}, a, \{ q_2, q_3 \} )$
    </div>
    </details>

  - $( \{ q_2, q_3 \}, b, \{ q_1 \} )$
  - $( \{ q_2, q_3 \}, c, \{ q_3 \} )$

  - 受理状態 $F'$ : $\{ \{ q_1 \}, \{ q_3 \}, \{ q_1, q_2 \}, \{ q_2, q_3 \} \}$ -->


<img src="images/image7-1-4.png" class="img-60" />

(空集合と初期状態から到達不可能な状態は除く)

</div>
</details>

<br/>

非決定性オートマトンの補 (Complementation) : $\overline{\mathcal{L}(\mathcal{A})} = \Sigma^* - \mathcal{L}(\mathcal{A})$

1. 非決定性オートマトンを決定性オートマトンに変換
2. 受理状態と非受理状態を入れ替える


## 7.2 Automata on Infinite Words

**無限**の文字列を扱える有限オートマトンを考える

  - Reactive system などを扱いたい

Büchi オートマトン : **無限**の文字列を扱える最も簡単な有限オートマトン

Regular オートマトンと構成要素は同じ : $(\Sigma, \mathcal{Q}, \Delta, \mathcal{Q}^0, F)$

ただし, 無限の文字列 $v \in \Sigma^{\omega}$ を扱える ($\omega$ は無限の繰り返しを表す)

<br/>

$inf(\rho)$ : 実行 $\rho$ で無限によく現れる状態 

  - 状態 $\mathcal{Q}$ は有限, 実行 $\rho$ は無限なので $inf(\rho)$ は空集合ではない

Büchi オートマトン $\mathcal{A}$ が実行 $\rho$ を**受理する** $\Leftrightarrow inf(\rho) \cap F \neq \emptyset$

- 受理状態 $F$ のどれかが実行 $\rho$ で無限によく現れる

$\mathcal{A}$ の**言語** (**language**) $\mathcal{L}(\mathcal{A}) \subseteq \Sigma^{\omega}$ : $\mathcal{A}$ によって受理されるすべての無限の文字列の集合 

<br/>

<details>
<summary><dev style="color: var(--main-color)">Example</dev></summary>
<div class="details-inner">

<img src="images/image7-1-2.png" class="img-40" />

受理状態 $q_1$ が無限によく現れるとき, その実行は受理される

- $(ab)^{\omega}$ は受理される?

    <details>
    <summary>答え</summary>
    <div class="details-inner">

    Yes

    </div>
    </details>

- $a^*b^{\omega}$ は受理される?

    <details>
    <summary>答え</summary>
    <div class="details-inner">

    No

    受理状態 $q_1$ は有限回しか現れない

    </div>
    </details>

$\mathcal{L}(\mathcal{A})$ : $(b^*a)^{\omega}$

ちなみに、このオートマトンはどんな LTL 式を変換したもの？

<details>
<summary>答え</summary>
<div class="details-inner">

$GF a$

</div>
</details>

</div>
</details>