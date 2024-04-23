# Typestate-Guided Fuzzer for Discovering Use-after-Free Vulnerabilities [ICSE'20]

## Abstract

- 既存のカバレッジベースのファザーは CFG のエッジカバレッジを使用してガイドする
- use-after-free のような脆弱性はこのカバレッジは効果的ではない
  - UAF を発見するためには特定の順序でプログラムを実行する必要あり
- UAF を typestate property としてモデル化し, 性質に違反する脆弱性を発見するためのファザー (UAFL) を開発
- typestate property が与えられると, 
  1. 静的な typestate 解析を行い, 性質に違反する可能性のあるシーケンスを見つける
  2. このシーケンスを基に, プロパティ違反を引き起こすプログラムを生成するファジングを行う
- ファジングプロセス効率化のために情報フロー (information flow) も導入

<br/>

## 1. Introduction

- UAF 脆弱性はかなり悪用される (UAF)
<br/>

- UAF は一連の操作を特定の順序で行う必要があり, 検出が難しい
  - コード内では同じ場所にないかも

<br/>

- 静的解析による UAF の検知は false positive が多い
  - スケーラブルで正確な inter-procedural なエイリアス解析が困難
- エイリアス解析の不正確な結果は実行時検出メカニズムの有効性にも影響するかも
  - [FreeSentry](https://www.talosintelligence.com/freesentry), [DangNULL](https://wenke.gtisc.gatech.edu/papers/dangnull.pdf)

<br/>

- 動的な手法 (グレーボックスファジングなど) は誤検出が少ない
  - しかし既存の手法は UAF の検出に効果的ではない
- 既存のカバレッジファザー (AFL など) は CFG のエッジカバレッジを使用する
  - しかし UAF 脆弱性をトリガーするには CFG エッジをカバーするだけでなく, 特定の順序で実行する必要あり
  - 最先端のグレーボックスファザー ([MOpt](https://www.usenix.org/conference/usenixsecurity19/presentation/lyu), [ProFuzzer](https://ieeexplore.ieee.org/document/8835384)) は UAF をほとんど発見できない

<br/>

- 特定の typestate プロパティに違反する脆弱性を発見するための typestate-guided fuzzer (UAFL) を提案
- 多くの一般的な脆弱性は特定の typestate プロパティの違反として見ることができる
  - UAF : $malloc \to free \to use$
  - Null pointer dereference : $nullify \to dereference$
- 色んな typestate 違反に対応できるが, 論文内では UAF に焦点を当てる

- 流れ
  1. typestate 解析を行い, プロパティに違反する可能性のある操作シーケンスを特定
  2. 操作シーケンスのカバレッジをターゲットプログラムに計装
- 計装から収集した情報に基づいて, ファザーの有効性を向上させる2つの戦略
  1. 操作シーケンスカバレッジをフィードバックとして使用する
  2. テスト入力がプログラム状態にどのような影響を与えるか推測するために情報フロー解析を導入し, 不要な変異を避ける