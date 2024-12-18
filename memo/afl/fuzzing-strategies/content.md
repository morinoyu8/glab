# Binary fuzzing strategies: what works, what doesn't

https://lcamtuf.blogspot.com/2014/08/binary-fuzzing-strategies-what-works.html

<br/>

- ファザーはファジングの戦略によって結果が左右される
- 入力ファイルへの変更が保守的すぎると限られたカバレッジしか達成できない
- 変更が積極的すぎると, ほとんどの入力が非常に早い段階で解析に失敗し, CPUサイクルを浪費し, 調査が困難な厄介なテストケースを吐き出すことになる

<br/>

- AFL のフィードバックでは, 入力ファイルのどのような種類の変更がコード内の新しいブランチの発見につながるのか, 無駄なのかを測定することができる

<br/>

- AFL ではファザーはすべての新しい入力ファイルに対して, ランダムな動作に入る前に, 決定論的なファジング戦略を段階的に進める
  - ビットフリップ, 単純な算術など
- 最も単純でエレガントなテストケースを生成したいため
- さらに, それぞれの新しい戦略がどれだけの価値があるのか, 定量的に判断できる材料となる

<br/>

- 適度な大きさのテストケースに対する AFL のファジングの効率は画像ファイルからアーカイブまで一貫している
- それぞれのファジングの戦略を見ていく

<br/>

### Walking bit flips

- 順番に並んだビットを反転させる
- (多分全部のビットを反転させている?入力ファイルのサイズって一般的にどのくらい?)
- ステップオーバーは常に 1ビット
- 1,2,4ビットを連続で反転させる
- この戦略は重い (各 pass は入力ファイルのバイトごとに8つの `execve()` を必要とする)
- AFL は 3回の pass で停止し, 次の戦略に移る

<br/>

### Walking byte flips

- 1バイトのステップオーバー
- 8,16,32ビットのビットフリップ
- 各 pass は入力ファイルの1バイトあたり1回の `execve()` を必要とする

<br/>

### Simple arithmetics

- 入力ファイル内の既存の整数値をインクリメントまたはデクリメントする
- 実験的に選ばれた操作の範囲は -35~+35
- 実装的には3つの別々の操作
  1. 個々のバイトに対して引き算と足し算を実行しようとする
  2. 16ビット値について, 最上位バイトにも影響がある場合のみ, インクリメントとデクリメントを行う
  3. 32ビット整数
- コストは比較的高く, 1バイトあたり平均 20回の `execve()` の呼び出しが必要
- +/-16 にすれば大幅に改善される? 

<br/>

### Known integers

- エッジ状態をトリガーする可能性の高いハードコードされた整数セットを試す
  - (`-1`, `256`, `1024`, `MAX_INT - 1`, `MAX_INT`)
- ファザーは1バイトのステップオーバーを利用して, 入力ファイル内のデータを約24個の興味深い値で上書きする
- 1バイトあたり30回の `execve()` 呼び出し

<br/>

### Stacked tweaks

- 特定の入力ファイルに対して決定的な戦略を使い果たした場合, 以下のランダムな操作でループを続ける
  - シングルビットフリップ
  - 興味深いバイトなどを設定する試み
  - バイトなどに対する小さな整数の加算減算
  - 完全にランダムな1バイトセット
  - ブロック削除
  - 上書き・挿入によるブロックの複製
  - ブロック memset?
- 実験の結果各操作の確率が同じ場合に, 最適な実行パスの収束となる
- 操作の数は1から64の間の2の冪乗として選択され, ブロックサイズは 1kBが上限
- このステージの収束は決定論的ステージによって発見された実行パスの総数と同じかそれ以上

<br/>

### Test case splicing

- キューから少なくとも2箇所が異なる2つの入力ファイルを取り出す
- 真ん中のランダムな位置で結合する
- この戦略では, 前の操作だけではトリガーしそうにない実行パスを20%ほど追加で発見する

<br/>

- 決定論的なブロック操作は網羅的に試みられていない
  - 一般的に2次関数かそれ以上の時間を必要とする