// Config for Mozilla's web-ext tool (lint / run / build / sign).
// Keeps non-extension files out of the packaged add-on.
export default {
  sourceDir: ".",
  artifactsDir: "web-ext-artifacts",
  ignoreFiles: [
    "README.md",
    "PRIVACY.md",
    "STORE.md",
    "CHANGELOG.md",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "web-ext-config.mjs",
    "store/**",
    "web-ext-artifacts/**",
    "node_modules/**",
    ".git/**",
    ".github/**",
    ".idea/**",
    ".junie/**",
    ".vscode/**",
    "*.zip",
    "*.xpi",
    "*.crx",
  ],
  build: {
    overwriteDest: true,
  },
  run: {
    target: ["firefox-desktop"],
  },
};
