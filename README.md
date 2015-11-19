# node-diffmk

差分ファイルを作るライブラリ

## 概要

- ファイルリストで指定したファイルをコピーして、新しいファイル群を作成する
  - ファイルリストは単純にパスを列挙したテキストファイルです
  - 1行に1つのパスを記述します
- 既存で存在するファイルをコピーすることを前提とするため、ファイルリストに間違いがあった場合は処理されません


__ディレクトリレイアウト__

```
@current
 ├ ← public
 ↓   ├── html
 |   |   ├── index.html
 ↓   |   ├── about.html
 |   |   └── access.html
 ↓   ├── css
 |   |   └── style.css
 ↓   └── doc
 |       └── README.txt
 ↓
 ---✂︎---------------------
 ├── [filelist].txt
 ↓    # ファイルリストで指定されたファイルのみコピーしてくる
 |    # 新規のフォルダ名は、[filelist]の名前に基づいて生成する
 ↓
 └ → diff@[filelist]
     └── public
         ├── html
         |   └── index.html
         └── doc
             └── README.txt
```

__[filelist].txt__

```txt
public/html/index.html
public/css/style.css
public/doc/README.txt
```

__JavaScript__

```js
const diffmk = require('node-diffmk');
diffmk('release-20150101');
```


## タスク

- [x] 差分ファイルのリストからファイル群を生成する
- [ ] ツリーテキストから差分ファイルリストを作ってファイル群を生成する
- [x] ルートディレクトリを作成する際、既存のファイルがあったら先に削除する
- [ ] オプションの定義
    - `basedir`: 基準となるフォルダ (デフォルト: カレントディレクトリ)
    - `prefix`: 新規フォルダのフォルダ名の接頭辞(デフォルト: `diff@`)
