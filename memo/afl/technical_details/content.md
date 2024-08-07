# Technical "whitepaper" for afl-fuzz

https://github.com/google/AFL/blob/master/docs/technical_details.txt

- AFL の内部構造についての説明
- AFL の使用方法は README
- AFL の動機と設計目標については historical_notes.txt を参照

## 1. カバレッジ測定

- プログラムへの計装はエッジカバレッジと分岐を通った回数をカウント
- プログラムに挿入されるコード

```c
cur_location = <COMPILE_TIME_RANDOM>;
shared_mem[cur_location ^ prev_location]++; 
prev_location = cur_location >> 1;
```

- `cur_location` の値はランダムに生成される
- `shared_mem[]` 配列は計装されたバイナリに渡される 64KB の共有メモリ領域
  - `(branch_src, branch_dst)` のタプルのヒットとみなすことができる

<br/>

- マップのサイズは通常 2k から 10k の分岐数を持つほとんどのターゲットに対して, 衝突がまれにしか発生しないように選ばれる

    | ブランチ数 | 衝突タプル | ターゲット例
    | ---: | :--- | :--- |
    | 1,000 | 0.75% | giflib, lzo |
    | 2,000 | 1.5% | zlib, tar, xz |
    | 5,000 | 3.5% | libpng, libwebp |
    | 10,000 | 7% | libxml |
    | 20,000 | 14% | sqlite |
    | 50,000 | 30% | - |

- 同時に, このサイズは受信側でマップをマイクロ秒単位で解析できるように, L2 キャッシュ内に収まるようにしている
- この形式のカバレッジは単純なブロックカバレッジよりもより深い洞察を (次が区別できる)
  - A -> B -> C -> D -> E (tuples: AB, BC, CD, DE)
  - A -> B -> D -> C -> E (tuples: AB, BD, DC, CE)
- これによって微妙な脆弱性の発見が促進される
  - セキュリティ脆弱性は新しい基本ブロックに到達するよりも予期しない・誤った状態遷移に関連することが多い
  
<br/>

- シフト操作を行う2つの理由
  - タプルの方向性を保持する (A -> B と B -> A を区別する)
  - 自己ループを区別する (シフトがないと, A -> A と B -> B が同じになってしまう)

<br/>

- Intel CPU で簡単な飽和算術演算が存在しないため, ヒットカウンタがゼロに巻き戻るかも
  - 稀だから気にしない

<br/>

## 2. 新しい動作の検出

- ファザーは過去の実行で見られたタプルのグローバルマップを保持する
  - このデータは個々のトレースと迅速に比較され, 数個のタブル or クワッドワイドの命令 (16, 64ビットの命令?) と単純なループで更新できる
- 変異した入力が新しいタプルを含む実行トレースを生成すると, その入力ファイルが保存される
  - 逆に新しいタプルを生成しないものは破棄される
- これによってパス爆発を防ぐ

<br/>

- 以下の例では新しいタプル (CA, AE) が存在するため, 2番目のトレースは新しいものとみなされる
  - #1: A -> B -> C -> D -> E
  - #2: A -> B -> C -> A -> E
- その後の以下のパターンは実行パスが大きく異なるが, 新しいタプルがないため, 新しいものとみなされない
  - #3: A -> B -> C -> A -> B -> C -> A -> B -> C -> D -> E

<br/>

- 新しいタプルの検出に加えて, タプルヒットカウントも計測する (以下のバケットに分けられる)
  - 1, 2, 3, 4-7, 8-15, 16-31, 32-127, 128+
- 8ビットカウンタを1ビットごとにそれぞれのバケットにする
- 新しいバケットに触れると興味深いものとしてフラグが立てられ, テストケースが保存される
  - 通常1回しか実行されないエッジを2回通ったときと区別できる
  - 同時に, 47 サイクルから 48 サイクルのような経験的にあまり注目されない変化には鈍感
  - タプルの衝突における免疫もある程度提供

<br/>

- 実行はメモリと実行時間の制限によって厳しく管理
- デフォルトでは, タイムアウトは初期キャリブレーションされた実行速度の5倍に設定され, 20msで切り上げられる
  - ファザーのパフォーマンスが劇的に低下するのを防ぐ

<br/>

## 3. 入力キューの成長

- プログラム内で新しい状態遷移を生じた変異テストケースは入力キューに追加され, 将来のファジングに使用される
- このアプローチでは, 基礎となるデータフォーマットの様々な不連続で, おそらく相互に互換性のない特徴を, 段階的に探索することができる :
  
  <img src="http://lcamtuf.coredump.cx/afl/afl_gzip.png" class="img-100" />

- このプロセスで生成された合成コーパスは, 本質的に何か新しいものをするだろうという入力ファイルのコレクション
  - 後続の他のテストプロセスのシードとすることもできる
- このアプローチによってほとんどのターゲットのキューは 1k から 10k に成長する
  - 10-30% が新しいタプルの発見に関連し, 残りはヒットカウントの変化に関連する
- ここから AFL はすごいよって話が書かれている

<br/>

## 4. コーパスの選択

- 後半で生成されたテストケースは, その祖先が提供するカバレッジの厳密なスーパーセットのエッジカバレッジを持つ可能性が高い
- ファジングの効率を上げるために, AFL は定期的にキューを再評価
  - これまで見られたすべてのタプルをカバーし, ツールにとって特に有利な特性を持つテストケースのより小さなサブセットを選択するアルゴリズム

<br/>

- このアルゴリズムは各キューのエントリに実行レイテンシとファイルサイズに比例したスコアを割り当てる
- 各タプルの最低スコアの候補を選択することで機能する

<br/>

- 次にタプルはシンプルなワークフローで実行
  1. 一時的な working set にまだないタプルを見つける
  2. このタプルの勝利キューエントリを見つける
  3. そのエントリのトレースに存在するすべてのタプルを working set に含める
  4. working set にないタプルがまだあるなら, 1に戻る


<br/>

- 生成された "favored" エントリのコーパスは通常のコーパスの 5~10倍小さくなる
- 好ましくないエントリは破棄されないがキューで遭遇したときに異なる確率でスキップされる
  - キューにまだファジングされていない新しいエントリがあるなら, 99% の好ましくないエントリがスキップ
  - 新しい好ましいエントリがない場合
    - キューから取り出した好ましくないエントリが以前にファジングされているなら, 95% の確率でスキップ
    - まだファジングされていなければ, 75%の確率でスキップ

<br/>

- これは実証実験に基づいて, キューのサイクル速度とテストケースの多様性が合理的に保たれる
- 洗練されたがはるかに遅い選択では `afl-cmin` を使用して実行できる
  - 冗長なエントリーを永久に破棄する

<br/>

## 5. 入力ファイルのトリミング

- 大きなファイルはターゲットバイナリを遅くし, 変異が重要な部分に触る可能性が低くなる
  - 詳細は `perf_tips.txt` に書かれている
- 一部の変異はファイルサイズを反復的に増加させる可能性があるため, 対処が必要
- 計装のフィードバックによって, ファイルに加えた変更が実行パスに影響を与えないようにしながら, 入力ファイルのサイズを自動的に削減する簡単な方法が提供される

<br/>

- `afl-fuzz` の組み込みトリマーはデータブロックを順次削除しようとする (長さとステップは可変)
- トレースマップのチェックサム (元々のファイルの実行パス?) に影響を与えないものは変更を適用する
- すべての無駄なブロックを削除しようとはしない
- 精度とこのトリミングで発生する `execute()` の呼び出し回数のバランスを取る
- ファイルの平均的な利益 (ファイルサイズ?実行時間?) は 5~20%程度

<br/>

- `afl-trim` ツールはより徹底的で反復的なアルゴリズム
  - トリミングされたファイルにアルファベットの正規化を行おうとする
- まず, ツールは動作モードを自動的に選択
  - 非計装モード: 初期入力がターゲットバイナリをクラッシュさせる場合
    - よりシンプルなファイルを作るが, まだターゲットをクラッシュさせるような微調整を維持する
  - 計装モード: クラッシュさせる場合
    - 正確に同じ実行パスを生成する変更のみを保持する
- 実際の最小化アルゴリズムは以下の通り
  1. 大きなステップオーバーで大きなデータブロックをゼロにすることを試みる
     - たぶんでっかいのをここで削除する
  2. 二分探索で, ブロックサイズとステップオーバーを減らしながら, ブロックを削除する
     - たぶんブロックサイズを 1/2 -> 1/4 -> 1/8 というように小さくしていく?
  3. ユニークな文字をカウントし, それをゼロにするアルファベット正規化を行う
  4. 非ゼロのバイトに対してバイト単位の正規化を行う
- 0x00 バイトでゼロにする代わりに, ASCII の `'0'` (0x30?) を使用する
  - テキスト解析に干渉する可能性が低いため, テキストファイルの最小化に成功する可能性が高い

<br/>

## 6. ファジング戦略

- フィーダバックによって, 様々なファジング戦略の価値を理解し, 様々なファイルタイプで同じように機能するように, パラメータを最適化することが容易になる
- `afl-fuzz` に使われる戦略の [詳細](../fuzzing-strategies/)
- 初期の段階では, `afl-fuzz` によって行われる作業の大部分は非常に決定論的
- 後の段階でランダムな修正 (random stacked modifications) や既存のテストケースから新しいテストケースの生成 (test case splicing) を行う

<br/>

- 決定論的な戦略は以下
  - 様々な長さとステップオーバーでのビットフリップ
  - 小さな整数の加減算
  - 興味深い整数 (`0`, `1`, `INT_MAX` など) の挿入
- 決定論的なステップから始める理由は, 非クラッシュ入力とクラッシュ入力の小さな差分を生成する傾向があることに関連する

<br/>

- 決定論的なファジングの後は, 非決定論的な積み重ねられた色々な操作をする
  - ビットフリップ
  - 挿入
  - 削除
  - 算術
- また, 異なるテストケースの結合も行われる

<br/>

- これらの戦略の効果と `execve()` のコストは調査され, ブログの記事で議論されている
- パフォーマンス, シンプルさ, 信頼性から, AFL は特定の変異とプログラム状態の関係について議論しようとはしない
- 新しいキューエントリが決定論的なファジングステップの最初を通過して, ファイル内の一部の領域への変更が実行パスのチェックサムに影響を与えない場合, それらの領域は決定論的ファジングから除外され, ランダムな変異に直接進むことがある
  - 実行数を 10~40% 減らせる
  - block-aligned　tarアーカイブのような場合だと, 90% 程度削減できる
- 基礎となる effector map は, キューエントリごとにローカルで, ファイルサイズや一般的なレイアウトを変更しない決定論的なステージの間だけ効力を維持する

<br/>

## 7. 辞書

- フィードバックによって以下が容易になる
  - 入力の構文トークンを自動的に識別 
  - 事前に定義・自動検出された辞書用語の特定の組み合わせが, テストされたパーサにとって有効な文法を構成していることを検出
- これらの機能が `afl-fuzz` でどのように実装されているかの [詳細](../dictionary/)

<br/>

- 計装とキューの設計によって, 無意味な変異と新しい動作をする変異を区別するフィードバックメカニズムを提供
- より複雑な構文を段階的に構築する
- 辞書は, JavaScript, SQL, XML のような言語の文法をファザーが迅速に再構築することを可能にする
- 計装によって AFL は入力ファイルに存在する構文トークンを自動的に分離できる
  - 反転させた時にプログラムの実行パスに一貫した変化をもたらすバイト列を探すことで行うことができる
  - コードに埋め込まれいいる定義済みの値とのアトミックな比較を示唆?
  - このシグナルを頼りにコンパクトな「自動辞書」を構築し, 他のファジング戦略と組み合わせて使用する

<br/>

## 8. クラッシュの重複削除

- クラッシュの重複削除は, 有能なファジングツールにとって重要な問題
- フォールトが共通のライブラリ関数 (`strcmp`, `strcpy` など) で発生した場合, フォールトアドレスだけ見ると, 全く関係ない問題が同じになってしまう可能性あり
- 一方, コールスタックバックとレースを見ると, 再帰的なコードパスを通って到達できる場合, クラッシュカウントが極端に膨れ上がるかも

<br/>

- AFL は 2つの条件のいずれかが満たされた場合に, クラッシュが一意であるとみなす
  - クラッシュトレースに, 以前のどのクラッシュにも見られなかったタプルが含まれている
  - クラッシュトレースには以前のフォールトで常に存在していたタプルが欠けている

<br/>

## 9. クラッシュの調査

- 多くのクラッシュの悪用可能性は曖昧な場合がある
- `afl-fuzz` はクラッシュしない変異は捨てられるが, 既知のフォールトテストケースが通常の操作のようにファジングされる, クラッシュ探索モードを提供する
- このアプローチの価値に対する [議論](http://lcamtuf.blogspot.com/2014/11/afl-fuzz-crash-exploration-mode.html)
- フィードバックを利用して, クラッシュしたプログラムの状態を探索し, あいまいなものからレビューしやすい入力を分離
- クラッシュはトリミングされない

<br/>

## 10. fork server

- パフォーマンス向上のために `afl-fuzz` は "fork-server" を使用する
- このサーバではファジングされるプロセスは, `execve()`, リンク, libc の初期化を一度だけ通過
- コピーオンライトを利用して停止したプロセスイメージからクローンされる
- 実装の [詳細](../fork-server/)

<br/>

- 高速なターゲットだと, フォークサーバは 1.5~2倍のパフォーマンス向上を提供できる
- また, 以下のことも可能
  - フォークサーバを手動 (遅延) モードで使用し, ユーザが選択した初期化コードの塊をスキップする
    
    対象プログラムへの変更はわずかで, 対象によっては 10倍以上の性能向上が期待できる

  - ひとつのプロセスで複数の入力を試す persistent モードを有効にし, `fork()` 呼び出しの繰り返しによるオーバーヘッドを大幅に制限する

    ターゲットプログラムに若干の変更が必要になるが, パフォーマンスを5倍以上向上させることができる
    
    ファザープロセスとターゲットプロセスの分離を維持したまま, プロセス内ファジングジョブの利点に近づけることができる