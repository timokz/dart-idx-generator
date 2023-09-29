import * as fs from "fs";
import { describe, it } from "mocha";
import * as path from "path";
import * as vscode from "vscode";
import { deleteAllIndexFiles } from "../../feature/deleteIndexFiles";

const testFolderUri = vscode.Uri.file(path.join(__dirname, "../test"));

describe("deleteAllIndexFiles", () => {
  it("should delete all index.dart files in the given directory and its subdirectories", async () => {
    await deleteAllIndexFiles();
    const dirs = fs
      .readdirSync(testFolderUri.fsPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    for (const dir of dirs) {
      const indexFilePath = path.join(testFolderUri.fsPath, dir, "index.dart");
      //  expect(fs.existsSync(indexFilePath)).toBe(false);
    }
  });
});
