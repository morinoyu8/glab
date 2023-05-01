# このサイトの話

春休みにゼミの資料置き場を作った

## 開発の話

- 1 から HTML, CSS, Javascript を書いている

  - 勉強になった

- Markdown から HTML まで動的に変換してるのでレスポンス遅め

  - [Marked](https://marked.js.org): Markdown を HTML に変換
  - [MathJax](https://www.mathjax.org): tex 記法を数式に変換 <- これが遅め

- Github には事前に HTML に変換したものを保存しておくのもあり

## コードブロックの特徴

- 行数表示が簡単

  - 言語の後に `=` をつけるだけ

````
```c
printf("Hello ");
printf("World\n");
```

```c=
printf("Hello ");
printf("World\n");
```

```c=100
printf("Hello ");
printf("World\n");
```
````

```c
printf("Hello ");
printf("World\n");
```

```c=
printf("Hello ");
printf("World\n");
```

```c=100
printf("Hello ");
printf("World\n");
```

<br/>

- diff もシンタックスハイライトを付けられる

  - `diff_c` のように `diff` の後に言語をつける  

````
```diff_c=
+ printf("Hello ");
- printf("Hello");
  printf("World\n");
```
````

```diff_c=
  printf("Hello ");
+ printf("World\n");
- printf("World");
```

<br/>

- 行の強調ができる (独自記法)

  - コメント `//@@(...)@@` で `...` の中の CSS が適用される
 
````
```c=
int main(void) {
    print("Hello World\n");
    return 0;  // Comment @@(background-color: #eeee00)@@
}
```
```` 

```c=
int main(void) {
    print("Hello World\n");
    return 0;  // Comment @@(background-color: #eeee00)@@
}
```

<br/>

今後も色々な機能を追加したい