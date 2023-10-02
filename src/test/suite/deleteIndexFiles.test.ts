import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import { deleteAllIndexFiles } from "../../feature/deleteIndexFiles";

const tempPath = os.tmpdir();

const testFolderUri = vscode.Uri.file(path.join(tempPath, "../test"));

suite("deleteAllIndexFiles", () => {
  setup(() => {
    fs.mkdirSync(testFolderUri.fsPath, { recursive: true });
    fs.mkdirSync(path.join(testFolderUri.fsPath, "subdir"), {
      recursive: true,
    });

    fs.writeFileSync(
      path.join(testFolderUri.fsPath, "subdir", "index.dart"),
      "Sample content"
    );
  });

  teardown(() => {
    fs.rmSync(testFolderUri.fsPath, { recursive: true });
  });

  test("should delete all index.dart files in the given directory and its subdirectories", async () => {
    await deleteAllIndexFiles();

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
