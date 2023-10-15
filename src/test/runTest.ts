import * as path from "path";

import { runTests } from "@vscode/test-electron";

async function main() {
  console.log("runTests called");
  try {
    // The directory containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../");

    console.log("extensionDevelopmentPath", extensionDevelopmentPath);

    // The path to the extension test runner script
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index");

    console.log("extensionTestsPath", extensionTestsPath);

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ["--disable-extensions"],
    });

    console.log("Tests completed successfully");
  } catch (err) {
    console.error(err);
    console.error("Failed to run tests");
    process.exit(1);
  }
}

main();
