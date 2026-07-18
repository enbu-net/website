---
title: enbu documentation
description: Get started with GitHub-native, end-to-end encrypted environment management.
---

enbu is a `.env` management tool that works entirely through GitHub.
It encrypts secrets for each team member and stores only ciphertext in GHCR.

## Install enbu Desktop

Download the installer for your platform from the [enbu website](/#download) or [GitHub Releases](https://github.com/yashikota/enbu/releases/latest).

## Install the CLI

```shell
go install github.com/yashikota/enbu@latest
```

Authenticate with GitHub, then initialize enbu inside a repository:

```shell
enbu auth login
cd your-repository
enbu init
```

Add a secret and write the encrypted environment back to a local `.env` file:

```shell
enbu add API_KEY "your-secret"
enbu pull
```

The private key remains in the operating system's secure storage.
