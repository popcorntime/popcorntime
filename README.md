<div align="center">
   <img align="center" width="128px" src="crates/popcorntime-tauri/icons/release/128x128@2x.png" />
	<h1 align="center"><b>Popcorn Time™</b></h1>
	<p align="center">
		Watch Movies, TV Shows and more...
    <br />
    <a href="https://popcorntime.app"><strong>popcorntime.app</strong></a>
    <br />
    <br />
    (Unstable Nightly releases can be found <a href="https://popcorntime.app/download#nightly">here</a>)
  </p>

![popcorntime](/resources/screenshot.jpg)

[![Test TS][b-tt]][l-tt] [![Test Rust][b-tr]][l-tr]
<br/>
[![Discord][b-ds]][l-ds] [![X][b-x]][l-x] [![FB][b-fb]][l-fb] [![DEEPWIKI][b-dw]][l-dw]

</div>

[b-tt]: https://github.com/popcorntime/popcorntime/actions/workflows/test-ts.yaml/badge.svg?branch=dev
[l-tt]: https://github.com/popcorntime/popcorntime/actions/workflows/test-ts.yaml
[b-tr]: https://github.com/popcorntime/popcorntime/actions/workflows/test-rust.yaml/badge.svg?branch=dev
[l-tr]: https://github.com/popcorntime/popcorntime/actions/workflows/test-rust.yaml
[b-fb]: https://img.shields.io/badge/Facebook-blue?logo=facebook&logoColor=white
[l-fb]: https://facebook.com/popcorntimetv
[b-x]: https://img.shields.io/badge/Twitter-black?logo=x&logoColor=white
[l-x]: https://x.com/popcorntimetv
[b-dw]: https://deepwiki.com/badge.svg
[l-dw]: https://deepwiki.com/popcorntime/popcorntime
[b-ds]: https://img.shields.io/discord/1419277122987491401?label=Discord&color=5865F2
[l-ds]: https://discord.gg/c57nkpMzW6

This is a **complete rebuild of Popcorn Time**. Not a fork, not a patch - a fresh start with new goals and a clean foundation. This repository will be the home for ongoing development, documentation, and releases.

#### What's New

- Modern, safer, and legal
- Cross-platform: desktop, mobile, and TV
- Open source and community driven
- Weekly published databases for developers and researchers - [issue #3113](https://github.com/popcorntime/popcorntime/issues/3115)
- Local media playback, not just links (soon)

## How Does Popcorn Time Differ?

Other platforms like JustWatch or Reelgood act as directories. They show you where content might be, but they don't let you do much beyond clicking through to a service.

Popcorn Time is different:

- The code is public, built by and for the community
- Our catalog is released weekly as [Parquet](https://parquet.apache.org/) datasets for developers and researchers
- You can play your own files, not just follow links
- Features and direction come from contributors, not corporate agendas
- We share strong, growing databases with everyone - we're not here to monetize discovery like the big guys

## Tech

Popcorn Time is a [Tauri](https://tauri.app/)-based application. Its UI is written in [React](https://react.dev/) using [TypeScript](https://www.typescriptlang.org) and its backend is written in [Rust](https://www.rust-lang.org/).

## Bugs and Feature Requests

If you have a bug or feature request, feel free to open an [issue](https://github.com/popcorntime/popcorntime/issues/new/choose)

## Contributing

If you'd like to help, check out [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

If you want to skip right to getting the code to actually compile, take a look at the [DEVELOPMENT.md](DEVELOPMENT.md) file.

## Sponsors

Popcorn Time is an MIT-licensed open source project with its ongoing development made possible entirely by the support of these awesome backers. If you'd like to join them, please consider [sponsoring Popcorn Time's development](https://github.com/sponsors/popcorntime).

<div align="center">
<table>
 <tr>
  <td>
    <a href="https://www.cloudflare.com/?utm_medium=opensource&utm_source=popcorntime">
    <img src="https://cf-assets.www.cloudflare.com/slt3lc6tev37/CHOl0sUhrumCxOXfRotGt/081f81d52274080b2d026fdf163e3009/cloudflare-icon-color_3x.png" width="101px"></a>
  </td>
  <td>
    <a href="https://www.digitalocean.com/?utm_medium=opensource&utm_source=popcorntime">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_horizontal_blue.svg" width="201px"></a>
  </td>
 </tr>
</table>
</div>
