<div align="center">
   <img align="center" width="128px" src="crates/popcorntime-tauri/icons/128x128@2x.png" />
	<h1 align="center"><b>Popcorn Time™</b></h1>
	<p align="center">
		Watch Movies, TV Shows and more...
    <br />
    <a href="https://popcorntime.app"><strong>popcorntime.app</strong></a>
  </p>

![popcorntime](/resources/screenshot.jpg)

[![Lint Rust][b-lr]][l-lr] [![Lint TS][b-lt]][l-lt] [![Test TS][b-tt]][l-tt] [![FB][b-fb]][l-fb] [![DEEPWIKI][b-dw]][l-dw]

</div>

[b-lr]: https://github.com/popcorntime/popcorntime/actions/workflows/lint-rust.yaml/badge.svg?branch=dev
[l-lr]: https://github.com/popcorntime/popcorntime/actions/workflows/lint-rust.yaml
[b-lt]: https://github.com/popcorntime/popcorntime/actions/workflows/lint-ts.yaml/badge.svg?branch=dev
[l-lt]: https://github.com/popcorntime/popcorntime/actions/workflows/lint-ts.yaml
[b-tt]: https://github.com/popcorntime/popcorntime/actions/workflows/test-ts.yaml/badge.svg?branch=dev
[l-tt]: https://github.com/popcorntime/popcorntime/actions/workflows/test-ts.yaml
[b-fb]: https://img.shields.io/badge/Facebook-blue?logo=facebook&logoColor=white
[l-fb]: https://facebook.com/popcorntimetv
[b-dw]: https://deepwiki.com/badge.svg
[l-dw]: https://deepwiki.com/popcorntime/popcorntime

This is a **complete rebuild of Popcorn Time**. Not a fork, not a patch - a fresh start with new goals and a clean foundation. This repository will be the home for ongoing development, documentation, and releases.

#### What's New

- Modern, safer, and legal
- Cross-platform: desktop, mobile, and TV
- Open source and community driven
- Weekly published databases for developers and researchers - [issue #3113](/popcorntime/popcorntime/issues/3115)
- Local media playback, not just links (soon)

## How Does Popcorn Time Differ?

Other platforms like JustWatch or Reelgood act as directories. They show you where content might be, but they don't let you do much beyond clicking through to a service.

Popcorn Time is different:

- The code is public, built by and for the community
- Our catalog is released weekly as [Parquet](https://parquet.apache.org/) datasets for developers and researchers
- You can play your own files, not just follow links
- Features and direction come from contributors, not corporate agendas
- We share strong, growing databases with everyone - we're not here to monetize discovery like the big guys

## What About Other Media Players?

We often get compared to other media players. Here's how Popcorn Time stands apart:

- Our catalog isn't rented from third parties - it's built, maintained, and published by us
- Weekly Parquet datasets let developers and researchers build on top of the same data we use
- No legacy systems or heavy dependencies
- Others focus on being media servers or directories. Popcorn Time is both a global streaming index **and** a local player - without bolted-on complexity

We're not here to be another aggregator or another closed media suite. We're here to change how discovery and playback work - open, fast, and community-driven.

## Tech

Popcorn Time is a [Tauri](https://tauri.app/)-based application. Its UI is written in [React](https://react.dev/) using [TypeScript](https://www.typescriptlang.org) and its backend is written in [Rust](https://www.rust-lang.org/).

## Bugs and Feature Requests

If you have a bug or feature request, feel free to open an [issue](https://github.com/popcorntime/popcorntime/issues/new/choose)

## Contributing

If you'd like to help, check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

If you want to skip right to getting the code to actually compile, take a look at the [DEVELOPMENT.md](DEVELOPMENT.md) file.

## Sponsorship 💜

This project is community-driven. If you'd like to support development and help us move faster, you can sponsor us:

👉 [GitHub Sponsors](https://github.com/sponsors/popcorntime)

Every contribution helps us dedicate more time to building the future of Popcorn Time.
