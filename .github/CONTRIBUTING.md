## Popcorn Time Contributing Guide

Hi! Thanks for checking out Popcorn Time. We’re excited you want to contribute. Please take a minute to read through our Code of Conduct and this guide before diving in.

- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Guide](#development-guide)

---

### Issue Reporting Guidelines

- The issue list of this repo is **exclusively** for bug reports and feature requests. Non-conforming issues will be closed immediately.

- If you have a question, you can get quick answers from the [Tauri Discord chat](https://discord.gg/SpmNs4S).

- Try to search for your issue, it may have already been answered or even fixed in the development branch (`dev`).

- Check if the issue is reproducible with the latest stable version of Popcorn Time. If you are using a nightly, please indicate the specific version you are using.

- It is **required** that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

- Issues with no clear repro steps will not be triaged. If an issue labeled "need repro" receives no further input from the issue author for more than 5 days, it will be closed.

---

### Pull Request Guidelines

- Open PRs against the dev branch.
- Keep PRs small and focused.
- Squash merges are used, so multiple commits in a PR are fine.
- For new features:
  - Open an issue first so the idea can be discussed.
- For bug fixes:
  - Reference issues with fix: … (fix #1234) in your PR title.
  - Explain the bug and how your fix solves it.
- CI must pass before merging (TS type-check, tests, Rust fmt/clippy).

### PR Checklist

- Builds locally (`pnpm dev`)
- pnpm type-check passes
- pnpm test passes (if applicable)
- cargo fmt + cargo clippy clean (if Rust touched)
- Screenshots/GIFs for UI changes

---

### Development Guide

_Requirements:_

- Node.js 20+, pnpm 10+
- Rust stable
- Tauri prerequisites (see https://tauri.app/start/prerequisites/)

To set up your machine for development, follow the [Tauri setup guide](https://v2.tauri.app/start/prerequisites/) to get all the tools you need to develop Tauri apps. The only additional tool you may need is [PNPM](https://pnpm.io/).

Next, [fork](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo) and clone [this repository](https://github.com/popcorntime/popcorntime).

The development process varies depending on what part of Popcorn Time you are contributing.

```
git clone https://github.com/popcorntime/popcorntime.git
cd popcorntime
pnpm install
pnpm dev
```

### Repo Layout

- `apps/desktop` - Tauri desktop app built with react-router)
- `packages/*` — Shared TypeScript packages (UI, configs, i18n, etc.)
- `crates/*` — Rust crates (error handling, GraphQL, tauri bindings, etc.)

---

### Code Style

- Use clear commit messages (feat:, fix:, refactor: are welcome but not enforced).
- Keep code typed, documented, and formatted.
- Avoid duplication — prefer shared packages/crates.

---

### Questions?

- Open a Discussion or Draft PR.
- Faster feedback is better than a “perfect” PR!

---

### Financial Contribution

Popcorn Time is MIT-licensed and community-driven. If you’d like to support the work, stay tuned for sponsorship options coming soon.
