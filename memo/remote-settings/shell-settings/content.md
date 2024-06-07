# シェルの設定いろいろ

## bash から zsh への切り替え

- 現在のシェルの確認

```sh
echo $SHELL
```

- ログインシェルの変更

```sh
chsh -s $(which zsh)
```

## シンタックスハイライトと補完

- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) : コマンドに色をつけてくれる
- [zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions) : コマンド履歴からコマンド候補を表示して入力補完もしてくれる

### インストール

```sh
sudo apt install zsh-syntax-highlighting
sudo apt install zsh-autosuggestions
```

- パッケージ内のファイル一覧の確認

```sh
dpkg -L {パッケージ名}
```

- `.zshrc` に以下を追加

```sh
source $USR_SHARE/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh
source $USR_SHARE/zsh-autosuggestions/zsh-autosuggestions.zsh
```

- この辺のプラグインの管理は [Oh My Zsh](https://ohmyz.sh) などを使ってもいいかも

## Starship

[Starship](https://starship.rs/ja-JP/): Rust製のプロンプト

表示内容の変更とか見た目の変更とかができる

### インストール

- Cargo へのパスを通すため `.zshrc` に以下を追加

```sh
export PATH="$PATH:$HOME/.cargo/bin"
```

- Cargo を使って Starship をインストール

```sh
cargo install starship
```

- 以下の記述を `.zshrc` に追加

```sh
eval "$(starship init zsh)"
```

- zsh に切り替えた時に自動で生成された `.zshrc` の中に以下があると starship が機能しなかったので消す

```sh
autoload -Uz promptinit
promptinit
prompt adam1
```


### 設定

- `~/.config/starship.toml` に置けば良い
  - `dotfiles` 内の `starship.toml` を実態として, シンボリックリンク作ればいいかも

- [ここ](https://starship.rs/ja-jp/config/) に色々な設定が書いてある