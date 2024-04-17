# Coverage

syzkaller はカバレッジ収集に [sanitizer coverage](https://clang.llvm.org/docs/SanitizerCoverage.html#tracing-pcs) (clang?) と [KCOV](https://www.kernel.org/doc/html/latest/dev-tools/kcov.html) (Linux?) を使う.

カバレッジはコンパイラが挿入した `coverage points` (基本ブロック or CFG エッジ) のトレースに基づく.

Linux のカバレッジ収集の詳細は [こちら](https://github.com/google/syzkaller/blob/master/docs/linux/coverage.md).

## Web Interface

`cover` リンクをクリックすると, カーネルビルドディレクトリにある各ディレクトリが表示される.

- `X% of N` : `N`個のカバレッジポイントの内 `X%` をカバーした.
- `---` : そのディレクトリのカバレッジは 0.

ソースコードビューで各ポイントのカバー状況がわかる? [ソースコードビューの色の説明](https://github.com/google/syzkaller/blob/master/docs/coverage.md#web-interface)