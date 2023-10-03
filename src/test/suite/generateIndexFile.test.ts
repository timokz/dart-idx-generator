import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import {
  generateIndexFile,
  generateIndexFilesForAllFolders,
} from "../../feature/generateIndexFile";

const tempPath = os.tmpdir();
const testFolderUri = vscode.Uri.file(path.join(tempPath, "/vsc_ext_test"));

suite("generateIndexFile Tests", () => {
  setup(() => {
    fs.mkdirSync(testFolderUri.fsPath, { recursive: true });
  });

  teardown(() => {
    fs.rmSync(testFolderUri.fsPath, { recursive: true });
  });

  test("should generate index.dart file in the given directory", async () => {
    await generateIndexFile();
    const indexFilePath = path.join(testFolderUri.fsPath, "index.dart");
    assert.strictEqual(fs.existsSync(indexFilePath), true);
  });
});

suite("generateIndexFilesForAllFolders Tests", () => {
  test("should generate index.dart file in all subdirectories of the given directory", async () => {
    await generateIndexFilesForAllFolders();
    const dirs = fs
      .readdirSync(testFolderUri.fsPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const dir of dirs) {
      const indexFilePath = path.join(testFolderUri.fsPath, dir, "index.dart");
      assert.strictEqual(fs.existsSync(indexFilePath), true);
    }
  });
});
