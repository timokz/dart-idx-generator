import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { deleteAllIndexFiles } from "../../feature/deleteIndexFiles";

const testFolderUri = vscode.Uri.file(path.join(__dirname, "../test"));

suite("deleteAllIndexFiles", () => {
  test("should delete all index.dart files in the given directory and its subdirectories", async () => {
    await deleteAllIndexFiles();

    const dirs = fs
      .readdirSync(testFolderUri.fsPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const dir of dirs) {
      const indexFilePath = path.join(testFolderUri.fsPath, dir, "index.dart");
      assert.strictEqual(fs.existsSync(indexFilePath), false);
    }
  });
});
