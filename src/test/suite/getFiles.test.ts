import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getFiles } from "../../utils/util";

const tempPath = os.tmpdir();
const testFolderPath = path.join(tempPath, "testFolder");

suite("getFiles Tests", () => {
  setup(() => {
    fs.mkdirSync(testFolderPath, { recursive: true });
    fs.writeFileSync(path.join(testFolderPath, "file1.dart"), "");
    fs.writeFileSync(path.join(testFolderPath, "file2.dart"), "");
    fs.writeFileSync(path.join(testFolderPath, "file3.txt"), "");
  });

  teardown(() => {
    fs.rmSync(testFolderPath, { recursive: true });
  });

  test("should return an array of .dart files in the given directory", async () => {
    const dartFiles = await getFiles(testFolderPath, ".dart");
    assert.strictEqual(dartFiles.length, 2);
    assert.strictEqual(dartFiles.includes("file1.dart"), true);
    assert.strictEqual(dartFiles.includes("file2.dart"), true);
  });

  test("should ignore files not matching the given extension", async () => {
    const dartFiles = await getFiles(testFolderPath, ".dart");
    assert.strictEqual(dartFiles.includes("file3.txt"), false);
  });

  test("should handle non-existent directory", async () => {
    const nonExistentFolder = path.join(testFolderPath, "nonexistent");
    const dartFiles = await getFiles(nonExistentFolder, ".dart");
    assert.strictEqual(dartFiles.length, 0);
  });
});
