# Mutation Mechanism

[Diving into Syzkaller’s mutation mechanism](https://gwangmu.medium.com/diving-into-syzkallers-mutation-mechanism-1-3-f15036a4087a)

<br/>

## Introduction

- ファザーの効率は変異させた入力の品質に依存する
  - カーネルがすぐにエラー処理などで拒絶するものであってはならない
  - 問題を引き起こす微妙な部分も残ってなくてはならない
- 入力に特定のフォーマットやテンプレートが必要な場合はさらに難しい

<br/>

- 最小限の許容された入力は一連のシステムコールとその引数で構成される必要がある
- これを変異させることは単に入力のバイトを変異させることよりも難しい
- このページでは syzkaller の変異メカニズムを説明する