---
title: はじめる
description: enbu をインストールし、ワークスペースの作成から最初の .env の同期まで試します。
sidebar:
  order: 1
---

enbu をインストールして、手元の `.env` を共有できる状態にします。
すでにチームから `enbu.toml` を受け取っている場合は、インストール後に[チームへの参加手順](/ja/docs/team/#ワークスペースに参加する)へ進んでください。

## インストール

デスクトップ版のインストーラーは、[enbu のダウンロードページ](/ja/#download)または [GitHub Releases](https://github.com/enbu-net/enbu/releases/latest) から取得できます。

CLI をインストールする場合は、お使いの OS に合わせて次のコマンドを実行します。

**macOS / Linux**

```sh
curl -fsSL https://enbu.net/install.sh | sh
```

**Windows（PowerShell）**

```powershell
irm https://enbu.net/install.ps1 | iex
```

Go を使う場合は、次のコマンドで CLI をインストールできます。

```sh
go install github.com/enbu-net/enbu@latest
```

## ワークスペースを作る

GHCR を使う場合は、プロジェクトのフォルダで GitHub にログインし、`enbu init` を実行します。
ログイン時は、CLI に表示されたコードをブラウザで承認します。
認証トークンは OS keyring に保存されます。

```sh
enbu auth login
enbu init
```

`origin` が GitHub を指していれば、enbu はリポジトリ名をもとに GHCR の保存先を提案します。
GitHub のリモートがなければ、ログイン中のアカウントとフォルダ名をもとに提案します。

別の保存先を使う場合は、`--storage` を指定します。
OCI レジストリと S3 の選択は、[ストレージと移行](/ja/docs/storage/)を参照してください。

`enbu init` は共有設定を `enbu.toml` に書き出し、最初の端末を管理者として登録します。

## .env を取り込んで同期する

既存の `.env` がある場合は、`enbu import` で選択中の環境に登録します。
`enbu pull` は、保存先から取得したシークレットを復号し、環境の出力ファイルに反映します。

```sh
enbu import .env
enbu pull
```

1 件だけ登録する場合は、たとえば `enbu add API_KEY` を実行し、非表示のプロンプトに値を入力します。

チームで共有するファイルは `enbu.toml` です。
復号済みの `.env` は Git の追跡対象から外してください。
他の端末を追加する手順は、[チームと権限](/ja/docs/team/)を参照してください。

## FAQ

### SSH 接続先から GitHub にログインできますか？

CLI に表示されたコードを別の端末のブラウザで承認できます。
接続先が Linux の場合は、認証トークンを保存できる OS keyring が必要です。

### 取り込み先に同じキーがあると、値は上書きされますか？

同じキーに異なる値があると、取り込みを中止します。
取り込む値で置き換える場合は `enbu import .env --overwrite` を使います。

### GitHub アカウントを切り替えられますか？

複数のアカウントを登録し、`enbu auth switch` で切り替えられます。
`GITHUB_TOKEN` が設定されている場合、GHCR への認証にはそのトークンが優先されます。
