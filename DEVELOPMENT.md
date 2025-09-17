# Hacking on Popcorn Time

Alright, so you want to build Popcorn Time yourself.

Respect. Grab your terminal, clear some space, and let's get this thing running.

---

## Table of Contents

- [Overview](#overview)
- [The Basics](#the-basics)
  - [Prerequisites](#prerequisites)
  - [Install dependencies](#install-dependencies)
  - [Run the app](#run-the-app)
  - [Lint & format](#lint--format)
- [Debugging](#debugging)
  - [Logs](#logs)
  - [Tokio](#tokio)
- [Troubleshooting](#troubleshooting)
- [Building](#building)
- [Contributing](#contributing)
- [Internal Notes](#internal-notes)
  - [Icon generation](#icon-generation)
  - [Release](#release)
  - [Versioning](#versioning)
  - [Publishing](#publishing)

---

## Overview

So how does this thing work?

Popcorn Time is a [Tauri app](https://tauri.app/).

Think [Electron](https://www.electronjs.org/), but lighter: a single desktop app for all major OSes, with the UI in HTML/JS.

The big difference: we don't ship Chromium. Tauri uses the system's built-in WebView, keeping the app small and closer to native performance.

Everything that touches disk, the network, or the OS runs in [Rust](https://www.rust-lang.org/). Almost everything you see runs in [React](https://react.dev/) with TypeScript.

For a deep dive into the architecture, see [DEEPWIKI](https://deepwiki.com/popcorntime/popcorntime).

---

## The Basics

OK, let's get it running.

### Prerequisites

Let's make sure you have all the prerequisites installed.

#### 1. Tauri

On macOS, ensure you've installed XCode and `cmake`.

On Linux, if you're on Debian or one of its derivatives like Ubuntu, you can use the following command.

<details>
<summary>Linux Tauri dependencies</summary>

```bash
sudo apt update
sudo apt install libwebkit2gtk-4.1-dev \
  build-essential \
  curl \
  wget \
  file \
  libxdo-dev \
  libssl-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev
```

</details>

Follow the official [Tauri installation guide](https://tauri.app/start/prerequisites/#system-dependencies) for more details.

#### 2. Rust

For both macOS and Linux, you can use the following rustup quick install script to get all the necessary tools.

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

For Windows, please follow the [official Rust installation guide](https://www.rust-lang.org/tools/install).

#### 3. Node

Next, ensure you've got at least Node 20 installed. If you're on macOS or Linux and you're missing `node`, you can use your favorite package manager like `brew` or `apt`.

Alternatively, you can use the following Node installer from Vercel to get the latest version.

```bash
curl https://install-node.vercel.app/latest > install_node.sh
sudo ./install_node.sh
```

#### 4. pnpm

We use `pnpm` as our javascript package manager. You can leverage `corepack`, which comes shipped with `node`, to install and use the `pnpm` version we defined in our `package.json`.

```bash
corepack enable
```

### Install dependencies

Next, install the app dependencies.

This will pull in a hefty set of `node_modules` (around 400 MB), so make sure you've got the space:

```bash
pnpm install
```

You'll have to re-run this occasionally when our deps change.

> [!NOTE]  
> We use [turborepo](https://turbo.build/repo) as our monorepo tooling and by default Vercel collects some [basic telemetry](https://turbo.build/repo/docs/telemetry). If you'd like to disable this, please run `pnpm exec turbo telemetry disable` once in the project's root directory after installing dependencies.

### Run the app

You should be able to run the app in development mode:

```bash
pnpm dev
```

### Lint & format

In order to have a PR accepted, you need to make sure everything passes our
Linters, so make sure to run these before submitting. Our CI will shame you
if you don't.

Javascript:

```bash
pnpm type-check   # type checking
pnpm format-check # check formatting (no changes applied)
pnpm format       # format and fix automatically
```

Rust:

```bash
cargo clippy   # see linting errors
cargo fmt      # format code
```

---

## Debugging

Now that you have the app running, here are some hints for debugging whatever it is that you're working on.

### Logs

The app writes logs into:

1. `stdout` in development mode
2. The Tauri [logs](https://tauri.app/v1/api/js/path/#platform-specific) directory

Since release builds are configured for public releases, they are very slow to compile.

Speed them up by sourcing the following file. (optional)

```bash
export CARGO_PROFILE_RELEASE_DEBUG=0
export CARGO_PROFILE_RELEASE_INCREMENTAL=false
export CARGO_PROFILE_RELEASE_LTO=false
export CARGO_PROFILE_RELEASE_CODEGEN_UNITS=256
export CARGO_PROFILE_RELEASE_OPT_LEVEL=2
```

### Tokio

We are also collecting tokio's runtime tracing information that could be viewed using [tokio-console](https://github.com/tokio-rs/console#running-the-console):

```bash
tokio-console
```

---

## Troubleshooting

Common issues and solutions when developing Popcorn Time.

### Turbo/build issues

#### Case-sensitive volume problems

If you're experiencing issues with the `dev` target failing to start, especially on macOS with case-sensitive filesystems, this may be related to Turborepo's handling of case-sensitive volumes.

**Solution:** See the related issue at [vercel/turborepo#8491](https://github.com/vercel/turborepo/issues/8491) for current workarounds.

#### Turbo daemon issues

If builds are hanging or behaving unexpectedly:

```bash
# Stop the turbo daemon
pnpm exec turbo daemon stop

# Clear turbo cache
pnpm exec turbo daemon clean

# Restart development
pnpm dev
```

### Cache issues

If you're seeing stale builds or unexpected behavior:

```bash
rm -rf .turbo node_modules
pnpm install
cargo clean
# Optional (Rust artifacts):
```

### Node.js & pnpm

Use the Node version pinned by `.nvmrc` (currently LTS “jod” / Node 22):

```bash
nvm install
nvm use
node -v
```

Use pnpm via Corepack (avoid global installs):

```bash
corepack enable
corepack pnpm -v
# optionally pin a major:
corepack prepare pnpm@10 --activate
```

### Additional resources

For issues specific to our toolchain components:

- [Turborepo issues](https://github.com/vercel/turborepo/issues)
- [Tauri issues](https://github.com/tauri-apps/tauri/issues)

If none of these solutions work, please check our [GitHub Issues](https://github.com/popcorntime/popcorntime/issues) or create a new issue with detailed information about your system and the error you're encountering.

---

## Building

To build the app in production mode, run:

```bash
pnpm tauri build --config crates/popcorntime-tauri/tauri.conf.nightly.json
```

This will make an asset similar to our nightly build.

## Contributing

Now that you're up and running, if you want to change something and open a PR for us, make sure to read [CONTRIBUTING.md](CONTRIBUTING.md) to make sure you're not wasting your time.

---

## Internal Notes

Most of this is for internal use, but maybe you will find it interesting too.

---

### Icon generation

When we update our app icon (`resources/app-icon.png`), run this to generate valid tauri version.

```bash
pnpm tauri:icon
```

### Release

Building is done via [GitHub Action](https://github.com/popcorntime/popcorntime/actions/workflows/publish.yaml).

Go to the link and select `Run workflow` from the desired branch.

### Versioning

When running the [release action](https://github.com/popcorntime/popcorntime/actions/workflows/publish.yaml), you will have to choose one of `major`, `minor`, or `patch` release type.

Action will generate a new version based on your input and latest version.
