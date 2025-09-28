# Storybook Documentation

This project uses [Storybook](https://storybook.js.org/) to document, develop, and test the UI components in `@popcorntime/ui`.

## Getting Started

### Local Development

To run Storybook locally:

```bash
# From the project root
pnpm --filter @popcorntime/ui storybook

# Or from the UI package directory
cd packages/popcorntime-ui
pnpm storybook
```

This will start Storybook on `http://localhost:6006`.

### Building for Production

To build a static version of Storybook:

```bash
# From the project root
pnpm --filter @popcorntime/ui build-storybook

# Or from the UI package directory
cd packages/popcorntime-ui
pnpm build-storybook
```

The static build will be created in `packages/popcorntime-ui/storybook-static/`.
