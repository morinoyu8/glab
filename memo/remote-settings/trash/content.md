# rm コマンドをゴミ箱に移動するようにする

[trash-cli](https://github.com/andreafrancia/trash-cli) を使う

## インストールと設定

1. `sudo apt install trash-cli`
2. `.bashrc` にエイリアスを追加
  
```sh
alias rm=trash-put
```

## 使い方

- ゴミ箱の中身を確認する
  
  ```sh
  trash-list
  ```

- ゴミ箱の中のファイルを元に戻す

  ```sh
  trash-restore
  ```

- ゴミ箱を空にする

  ```sh
  trash-empty
  ```

- ゴミ箱の中のファイルを完全に削除する

  ```sh
  trash-rm {ファイル名}
  ```