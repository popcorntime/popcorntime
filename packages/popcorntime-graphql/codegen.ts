import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  debug: true,
  verbose: true,
  schema: "http://localhost:8080",
  generates: {
    "src/types.d.ts": {
      plugins: ["typescript"],
      config: {
        useTypeImports: true,
        namingConvention: "keep",
        emitLegacyCommonJSImports: false,
        maybeValue: "T | null",
        scalars: {
          UUID: { input: "string", output: "string" },
          Date: { input: "Date", output: "Date" },
          DateTime: { input: "Date", output: "Date" },
          Country: {
            input: "import('@popcorntime/i18n').Country",
            output: "import('@popcorntime/i18n').Country",
          },
          Language: {
            input: "import('@popcorntime/i18n').Locale",
            output: "import('@popcorntime/i18n').Locale",
          },
          Tag: { input: "string", output: "string" },
        },
      },
    },
  },
};

export default config;
