# node-diffmk
差分ファイルを作るライブラリ

## 概要

ファイルリストで指定したファイルをコピーして、新しいフォルダに移動する。

__ファイルリスト__

```txt
public/html/index.html
public/css/style.css
public/doc/README.txt
```

__ディレクトリレイアウト__

```
@current
 ├ ← public - [files]
 ↓   ├── html
 |   |   ├── index.html
 ↓   |   ├── about.html
 |   |   └── access.html
 ↓   ├── css
 |   |   └── style.css
 ↓   └── doc
 |       └── README.txt
 ---[copy]---------------
 ↓
 └ → diff@[keyword]/public
     ├── html
     |   └── index.html
     └── doc
         └── README.txt
```

## タスク

- [x] 差分ファイルのリストからファイル群を生成する
- [ ] ツリーテキストから差分ファイルリストを作ってファイル群を生成する
- [ ] ルートディレクトリを作成する際、既存のファイルがあったら先に削除する
