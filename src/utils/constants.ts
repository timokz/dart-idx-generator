enum FileTypes {
  dart = ".dart",
  ts = ".ts",
  js = ".js",
}
// all general directories that can be excluded from being searched for files
export const excludedDirectories = [
  "**/node_modules/**",
  "**/.fvm/**",
  "**/.git/**",
  "**/.vscode/**",
  "**/.dart_tool/**",
  "**/.idea/**",
  "**/.vs/**",
  "**/.history/**",
  "**/.pub-cache/**",
  "**/.pub/**",
  "**/build/**",
  "**/coverage/**",
  "**/dist/**",
  "**/doc/**",
  "**/docs/**",
  "**/example/**",
  "**/examples/**",
  "**/generated/**",
  "**/gen/**",
  "/linux/**",
  "/windows/**",
  "/macos/**",
  "**/out/**",
  "**/packages/**",
  "**/test/**",
  "**/tests/**",
  "**/tmp/**",
  "**/vendor/**",
  "**/web/**",
  "**/www/**",
  "**/bin/**",
];

// regex to exclude all directories from excludedDirectories
export const excludedDirectoriesRegex = excludedDirectories.join("|");

// ignore all files that are generated, or shouldn't be exported
export const excludedFilesRegex =
  /^(?!.*\.g\.dart$|.*\.freezed\.dart$|.*main\.dart$).*\.dart$/;
