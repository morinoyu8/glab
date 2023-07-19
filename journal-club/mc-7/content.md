# Model Checking

### Ch.7 : Automata on Infinite Words and LTL Model Checking

## 概要

- 6章 : タブローを用いた LTL 式の検査

- 7章 : オートマトンを用いた LTL 式の検査

  - システムも性質もオートマトンで表す

### オートマトンを用いた LTL 式検査の概要



### 考えること

- オートマトンについて

  - [7.1 節](#71-finite-automata-on-finite-words) : 有限の文字列を扱える有限オートマトン
  - 7.2 節 : 無限の文字列を扱える有限オートマトン (Büchi オートマトン)
  - 7.3 節 : 決定的・非決定的オートマトン
  - 7.6 節 : 一般的な Büchi オートマトン について

- オートマトンの合成について

  - 7.4 節 : Büchi オートマトンの積



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

```c=
Figure: 7.1
```

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

```c=
Figure: 7.1
```

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

```c=
Figure: 7.1
```

$\mathcal{A}$ の言語 : $\varepsilon + (a + b)^{*}a$

</div>
</details>

<br/>

### 7.1.1 Determinization and Complementation

非決定的 (nondeterministic) オートマトン : ある状態から同じ文字でラベル付けされた複数の状態への遷移が存在する 

$$ (q, a, l), (q, a, l') \in \Delta , \text{where}\ l \neq l'$$

決定的 (deterministic) オートマトン : 上記の遷移が存在しない かつ 初期状態が一つ $|\mathcal{Q}^0| = 1$