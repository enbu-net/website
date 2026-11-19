---
title: enbu とは
description: API キーやパスワードを端末で暗号化して共有する、オープンソースの .env 管理ツールです。
---

enbu は、API キーやデータベースのパスワードを端末で暗号化し、開発チームや自分の複数端末で共有するツールです。
こうした秘密の値を **シークレット** と呼びます。
手元の `.env` を取り込み、別の端末で再び `.env` に書き出せるので、アプリケーションは従来どおり環境変数から値を読み取れます。

## 共有の流れ

1. **保存先を選んで初期化する。** シークレットとメンバーをまとめて管理する単位を **ワークスペース** と呼びます。共有設定は `enbu.toml` に記録されます。
2. **シークレットを登録する。** enbu が端末で暗号化し、暗号文と署名付きの履歴を保存先に送ります。
3. **利用する端末を承認する。** 管理者が端末の参加要求を承認すると、その端末の鍵でも現在のシークレットを復号できるようになります。
4. **アプリケーションから使う。** `enbu pull` で `.env` に書き出すか、`enbu run` で起動するプロセスに直接渡します。

<figure class="docs-flow">
<ol lang="en">
<li><strong>Device A</strong><span>Encrypt + sign</span></li>
<li><strong>OCI / S3</strong><span>Store ciphertext</span></li>
<li><strong>Device B</strong><span>Verify + decrypt</span></li>
</ol>
<figcaption>登録した値は端末で暗号化され、保存先を経由して承認済みの端末に届きます。</figcaption>
</figure>

## 保存先と端末の役割

保存先には GitHub Container Registry（GHCR）などの OCI レジストリや、S3 互換のオブジェクトストレージを使います。
保存先へのアクセスは提供元の認証で管理します。
シークレットの復号には、承認を受けた端末の秘密鍵が必要です。
別のメンバーが公開した変更を取り込むときは、enbu が署名と履歴を検証してから復号します。

## 他のツールとの比較

保存するものと、利用時に接続する先を比べると、既存の開発フローに合うツールを選べます。

| ツール | 管理の単位と保存先 | アプリケーションで使う方法 |
| --- | --- | --- |
| **enbu** | ワークスペースの環境ごとに値を管理し、既存の OCI レジストリや S3 互換ストレージに暗号文と署名付き履歴を保存 | 承認済みの端末で復号し、`enbu pull` で書き出すか `enbu run` で渡す |
| **SOPS** | YAML、JSON、dotenv などのファイルを暗号化し、Git などで管理 | age や KMS などで復号し、アプリケーションに渡す |
| **Doppler** | Doppler のサービス上でプロジェクトと設定を管理 | CLI で取得し、`doppler run` で環境変数として渡す |
| **Infisical** | Infisical Cloud または自分で運用する Infisical インスタンスでプロジェクトや環境を管理 | CLI で取得し、`infisical secrets-manager run` で環境変数として渡す |

暗号化した設定ファイルをコードと一緒にレビューする運用には SOPS、管理サービスに設定を集約する運用には Doppler や Infisical が候補です。
既存の OCI や S3 を使い、端末ごとの鍵で開発用の値を共有するなら enbu が候補になります。
本番と開発で閲覧者を分ける場合は、enbu では[ワークスペースを分けます](/ja/docs/team/#faq)。

- [SOPS の対応形式と復号方法](https://getsops.io/docs/reference/)
- [Doppler の CLI とシークレット取得](https://docs.doppler.com/docs/install-cli)
- [Infisical のセルフホスティング](https://infisical.com/docs/self-hosting/overview)
- [Infisical の CLI リファレンス](https://infisical.com/docs/cli/reference)

## ドキュメント

- [はじめる](/ja/docs/)で、インストールから最初の `.env` の同期まで試せます。
- [日常の使い方](/ja/docs/usage/)では、環境の切り替えや CLI、デスクトップアプリ、VS Code での使い方を扱います。
- [チームと権限](/ja/docs/team/)では、端末の承認、管理者の役割、メンバー削除時の作業を説明します。
- [同期・競合・履歴](/ja/docs/sync/)では、同時編集の扱いと以前の値に戻す方法を説明します。
- [ストレージと移行](/ja/docs/storage/)では、保存先の選択、移行、バックアップを扱います。
- [暗号化と信頼モデル](/ja/docs/security/)では、鍵の保管方法とセキュリティ上の前提を説明します。

## FAQ

### 専用サーバーや enbu Cloud の契約は必要ですか？

選んだ OCI レジストリや S3 互換ストレージがあれば、OSS 版だけで共有と履歴管理を行えます。
保存先には、提供元の料金と利用制限が適用されます。

### GitHub を使っていなくても導入できますか？

GHCR 以外の OCI レジストリや S3 互換ストレージを指定して導入できます。
`enbu.toml` は、チームで普段使っている共有経路で渡せます。

### 既存の Secrets Manager との違いは何ですか？

enbu は、アプリケーションの開発に使う `.env` の共有を中心に設計されています。
暗号化と復号は端末で行い、選んだストレージに暗号化されたデータと変更履歴を保存します。
