# DDRace: Finding Concurrency UAF Vulnerabilities in Linux Drivers with Directed Fuzzing [Usenix-security'23]

## Abstract

- Linux ドライバにおける UAF 脆弱性の大部分は, 並行処理 UAF 脆弱性
- 本論文では, Linux ドライバにおける並行 UAF 脆弱性を効率的に発見するために, 並行 directed ファジング DDRace を提案
  1. ターゲットサイトとして UAF の候補となる場所を特定し, 関連する並行性要素を抽出し, directed　ファジングの探索空間を削減
  2. UAF 脆弱性とスレッドのインターリーブをよく探索するようにファザーを誘導するために, 脆弱性に関連した新しい距離メトリクス (vulnerability-related distance metric) とインターリービング優先度スキーム (interleaving priority scheme) を設計
  3. テストケースの再現性を高めるために, 継続的にファジングを支援する適応的なカーネル状態移行スキーム (adaptive kernel state migration scheme) を設計
- DDRace を Linux カーネルドライバで評価すると並行 UAF を発見するのに効果的だった
  - 4つの未知の脆弱性と8つの既知の脆弱性を発見