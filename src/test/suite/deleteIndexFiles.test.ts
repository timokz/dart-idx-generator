import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import { deleteAllIndexFiles } from "../../feature/deleteIndexFiles";

const tempPath = os.tmpdir();
const testdirectoryUri = vscode.Uri.file(path.join(tempPath, "/vsc_ext_test"));

suite("deleteAllIndexFiles", () => {
  setup(() => {
    fs.mkdirSync(testdirectoryUri.fsPath, { recursive: true });
    fs.mkdirSync(path.join(testdirectoryUri.fsPath, "subdir"), {
      recursive: true,
    });

    fs.writeFileSync(
      path.join(testdirectoryUri.fsPath, "subdir", "index.dart"),
      "Sample content"
    );
  });

  teardown(() => {
    fs.rmSync(testdirectoryUri.fsPath, { recursive: true });
  });

  test("should delete all index.dart files in the given directory and its subdirectories", async () => {
    await deleteAllIndexFiles();

    const dirs = fs
      .readdirSync(testdirectoryUri.fsPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    for (const dir of dirs) {
      const indexFilePath = path.join(
        testdirectoryUri.fsPath,
        dir,
        "index.dart"
      );
      assert.strictEqual(fs.existsSync(indexFilePath), true);
    }
  });
});
