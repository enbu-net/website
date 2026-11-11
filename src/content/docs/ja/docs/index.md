---
title: enbu ドキュメント
description: エンドツーエンド暗号化で環境変数を管理する enbu の使い始め方。
---

enbu は、エンドツーエンド暗号化された `.env` マネージャーです。
シークレットをチームメンバーのデバイスごとに暗号化し、選んだストレージには暗号文だけを保存します。ストレージには GitHub Container Registry (GHCR)、ほかの OCI レジストリ、S3 互換のオブジェクトストレージを使えます。

## enbu デスクトップをインストールする

お使いのプラットフォーム用のインストーラーを [enbu のサイト](/ja/#download) か [GitHub Releases](https://github.com/enbu-net/enbu/releases/latest) からダウンロードしてください。

## CLI をインストールする

**macOS / Linux**

```sh
curl -fsSL https://enbu.net/install.sh | sh
```

**Windows (PowerShell)**

```powershell
irm https://enbu.net/install.ps1 | iex
```

Go でもインストールできます。

```sh
go install github.com/enbu-net/enbu@latest
```

## ワークスペースを用意する

enbu は GitHub 上の Git リポジトリの中で使います。プロジェクトがまだ GitHub にない場合は、[プロジェクトを GitHub に公開する](/ja/docs/put-your-project-on-github/)を見てください。

`origin` が GitHub にあるリポジトリでは、サインインして `init` を実行します。ワークスペースはリポジトリの隣の GHCR、`oci://ghcr.io/OWNER/REPO-enbu` に置かれます。

```shell
enbu auth login
cd your-repository
enbu init
```

GHCR はパッケージをあなただけが見られる非公開で作ります。チームメイトが参加できるように、GitHub でパッケージの設定を開き、リポジトリを接続して「Inherit access from repository」を有効にしてください。`init` もこの案内を表示します。

GHCR 以外を使うときは `--storage` で指定します。ほかの OCI レジストリは Docker の認証情報を、S3 は AWS SDK のデフォルトの認証チェーンを使います。

```shell
enbu init --storage oci://registry.example.com/team/secrets
enbu init --storage s3://your-bucket/team/workspace --region ap-northeast-1
```

`enbu init` は `enbu.toml` を書き出します。これをコミットしてチームに共有してください。最初に `init` を実行したデバイスがワークスペースの管理者になります。

## シークレットを追加して取り出す

シークレットを追加し、暗号化された環境をローカルの `.env` ファイルに書き出します。

```shell
enbu add API_KEY "your-secret"
enbu pull
```

値を省くと (`enbu add API_KEY`)、コマンドラインではなく非表示のプロンプトで入力できます。
シークレットをディスクに書き出さずに使うには、enbu 経由でコマンドを実行します。

```shell
enbu run -- npm start
```

## チームメンバーを追加する

新しいメンバーは、共有された `enbu.toml` のあるリポジトリで `enbu init` を実行します。
すると参加リクエストが出て、デバイスのフィンガープリントが表示されます。メンバーはそれをチャットや対面など別の経路で管理者に伝えます。
管理者はフィンガープリントを照合して、リクエストを承認します。

```shell
enbu member approve
```

承認するとすべての環境が再暗号化されるので、新しいメンバーはすぐに `enbu pull` できます。

秘密鍵はデバイスから出ません。TPM 2.0 や Secure Enclave があればそこに、なければ OS の安全な保管場所に置かれます。
