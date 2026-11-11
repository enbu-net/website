---
title: プロジェクトを GitHub に公開する
description: enbu は GitHub 上の Git リポジトリの中で使います。GitHub Desktop、VS Code、ターミナルでフォルダを公開する方法です。
---

enbu は、チームで共有している GitHub 上の Git リポジトリの中で使います。
enbu の設定は、そのリポジトリの `enbu.toml` というファイルに置かれ、チームメイトはリポジトリを pull するとこのファイルを受け取ります。
リポジトリが GitHub にあれば、enbu は暗号化したシークレットの置き場所として、その隣の GitHub Container Registry (GHCR) も提案します。

enbu に「このフォルダはまだ GitHub にありません」と表示されたら、次のどれかの方法でフォルダを公開し、enbu に戻って **もう一度確認** を押してください。

:::caution[シークレットを Git に入れない]
公開すると、フォルダの中のファイルが GitHub に置かれます。公開する前に、`.env` など秘密を含むファイルが入らないようにしてください。
フォルダに `.gitignore` というファイルを作って `.env` と 1 行書くか、ツールが含めるファイルを尋ねてきたときにそれらを外します。
:::

## GitHub Desktop

1. [GitHub Desktop](https://desktop.github.com/) をインストールし、GitHub アカウントでサインインします。
2. **File** > **Add local repository…** を選び、プロジェクトのフォルダを選びます。
3. フォルダが Git リポジトリではないと表示されるので、**create a repository** を押し、名前はそのままで **Create repository** を押します。
4. **Publish repository** を押します。公開するプロジェクトでなければ **Keep this code private** にチェックを入れたまま、**Publish repository** を押します。

フォルダがすでに Git リポジトリで、まだ GitHub にないだけなら、手順 3 は飛ばしてください。

## VS Code

1. **ファイル** > **フォルダーを開く…** でプロジェクトのフォルダを開きます。
2. **ソース管理** ビューを開きます (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>、macOS では <kbd>⌃</kbd>+<kbd>⇧</kbd>+<kbd>G</kbd>)。
3. **GitHub に公開** を押し、求められたら GitHub にサインインします。
4. 公開するプロジェクトでなければ、非公開 (private) のリポジトリを選びます。
5. VS Code が含めるファイルの一覧を出すので、`.env` など秘密を含むファイルのチェックを外してから確定します。

フォルダがすでに Git リポジトリで、まだ GitHub にないだけなら、ソース管理ビューの **Branch の発行** を押してください。

## ターミナル

先に [GitHub](https://github.com/new) で空のリポジトリを作ってから、プロジェクトのフォルダで次を実行します。OWNER と REPO は、あなたのアカウントか組織の名前とリポジトリ名に置き換えてください。

```sh
git init
git remote add origin https://github.com/OWNER/REPO.git
```

enbu に必要なのは、Git リポジトリとその `origin` リモートだけです。コミットや push はあとで構いません。

## 次に

enbu に戻って **もう一度確認** を押します。
enbu がストレージとして `oci://ghcr.io/OWNER/REPO-enbu` を提案し、ワークスペースを作るとあなたが最初の管理者になります。
そのあと `enbu.toml` をコミットして push すると、チームメイトが参加できるようになります。
