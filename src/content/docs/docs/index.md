---
title: enbu documentation
description: Get started with end-to-end encrypted environment management.
---

enbu is an end-to-end encrypted `.env` manager.
It encrypts secrets for each team member's device and stores only ciphertext in your storage: GitHub Container Registry (GHCR), another OCI registry, or S3-compatible object storage.

## Install enbu Desktop

Download the installer for your platform from the [enbu website](/#download) or [GitHub Releases](https://github.com/enbu-net/enbu/releases/latest).

## Install the CLI

**macOS / Linux**

```sh
curl -fsSL https://enbu.net/install.sh | sh
```

**Windows (PowerShell)**

```powershell
irm https://enbu.net/install.ps1 | iex
```

Or install with Go:

```sh
go install github.com/enbu-net/enbu@latest
```

## Set up a workspace

For GHCR, authenticate with GitHub, then initialize enbu inside a repository with the registry to use:

```shell
enbu auth login
cd your-repository
enbu init --storage oci://ghcr.io/your-org/your-repo-enbu --oci-auth github
```

Other OCI registries use your Docker credentials, and S3 uses the AWS SDK's default credential chain:

```shell
enbu init --storage oci://registry.example.com/team/secrets
enbu init --storage s3://your-bucket/team/workspace --region ap-northeast-1
```

`enbu init` writes `enbu.toml`. Commit and share it; the first device to run `init` becomes the workspace admin.

## Add and pull secrets

Add a secret and write the encrypted environment back to a local `.env` file:

```shell
enbu add API_KEY "your-secret"
enbu pull
```

Leave out the value (`enbu add API_KEY`) to type it at a hidden prompt instead of the command line.
To use the secrets without writing them to disk, run a command through enbu:

```shell
enbu run -- npm start
```

## Add a team member

A new member runs `enbu init` in the repository with the shared `enbu.toml`.
This leaves a join request and prints a device fingerprint, which they send to an admin over another channel.
The admin compares the fingerprint and approves the request:

```shell
enbu member approve
```

Approving re-encrypts every environment, so the new member can `enbu pull` right away.

The private key remains on the device, in TPM 2.0 or the Secure Enclave when available, otherwise in the operating system's secure storage.
