## General information

This is a monorepo with multiple projects.
The main applications are found in the `apps` directory.
They are:

- `desktop` containing the Tauri application's frontend code

The backend of the Tauri application is found in the `crates` directory. It contains different rust packages, all used for the Tauri application.

The `packages` directory contains different self-contained npm packages.

These are shared with the `desktop` application.

The packages are:

- `popcorntime-graphql` containing the GraphQL types
- `popcorntime-ui` containing the shared UI components
- `popcorntime-i18n` containing the i18n types and utils
- `typescript-config` containing the typescript configuration files
- `translator` containing the translation tools
