---
title: Put your project on GitHub
description: enbu works inside a Git repository on GitHub. Publish a folder with GitHub Desktop, VS Code, or the terminal.
---

enbu works inside a Git repository that your team shares on GitHub.
It keeps its settings in a file named `enbu.toml` in that repository, and your teammates get the file when they pull the repository.
When the repository is on GitHub, enbu also suggests storing the encrypted secrets beside it, on GitHub Container Registry (GHCR).

If enbu says that your folder is not a Git repository, or is not on GitHub yet, publish it with one of the ways below, then go back to enbu and click **Check again**.

:::caution[Keep your secrets out of Git]
Publishing puts the files in the folder on GitHub. Before you publish, make sure `.env` and other files with secrets are left out:
create a file named `.gitignore` in the folder with a line `.env`, or leave those files out when the tool asks which files to include.
:::

## GitHub Desktop

1. Install [GitHub Desktop](https://desktop.github.com/) and sign in to your GitHub account.
2. Choose **File** > **Add local repository…** and select your project folder.
3. GitHub Desktop says the folder does not appear to be a Git repository. Click **create a repository**, keep the name, and click **Create repository**.
4. Click **Publish repository**. Leave **Keep this code private** checked unless the project is meant to be public, and click **Publish repository**.

If the folder is already a Git repository that is not on GitHub, skip step 3.

## VS Code

1. Open your project folder with **File** > **Open Folder…**.
2. Open the **Source Control** view (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>, or <kbd>⌃</kbd>+<kbd>⇧</kbd>+<kbd>G</kbd> on macOS).
3. Click **Publish to GitHub** and sign in to GitHub if asked.
4. Choose a private repository unless the project is meant to be public.
5. VS Code lists the files to include. Uncheck `.env` and any other file with secrets, then confirm.

If the folder is already a Git repository that is not on GitHub, click **Publish Branch** in the Source Control view instead.

## Terminal

Create an empty repository on [GitHub](https://github.com/new) first, then run this in your project folder, with your account or organization and repository name:

```sh
git init
git remote add origin https://github.com/OWNER/REPO.git
```

enbu needs only the Git repository and its `origin` remote; you can commit and push later.

## Next

Back in enbu, click **Check again**.
enbu suggests `oci://ghcr.io/OWNER/REPO-enbu` as the storage, and creating the workspace makes you its first admin.
Commit and push `enbu.toml` afterwards so that your teammates can join.
