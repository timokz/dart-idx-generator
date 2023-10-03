/* eslint-disable @typescript-eslint/naming-convention */
/*  rule disabled because literal object are supposed to be in camelCase, 
    but we want to use the file extension as key, which are all lowercase */

export interface ExportStatement {
  (file: string): string;
}

export const exportStatements: { [key: string]: ExportStatement } = {
  ".ts": (file: string) => `export * from './${file}';\n`,
  ".js": (file: string) => `module.exports = require('./${file}');\n`,
  ".dart": (file: string) => `export '${file}';\n`,
};

export const specialDirectories: { [key: string]: string } = {
  ts: "src",
  js: "src",
  dart: "lib",
  ".ts": "src",
  ".js": "src",
  ".dart": "lib",
};
