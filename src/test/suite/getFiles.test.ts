import * as assert from "assert";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { getFiles } from "../../utils/util";

const tempPath = os.tmpdir();
const testdirectoryPath = path.join(tempPath, "/vsc_ext_test");

suite("getFiles Tests", () => {
  setup(() => {
    fs.mkdirSync(testdirectoryPath, { recursive: true });
    fs.writeFileSync(path.join(testdirectoryPath, "file1.dart"), "");
    fs.writeFileSync(path.join(testdirectoryPath, "file2.dart"), "");
    fs.writeFileSync(path.join(testdirectoryPath, "file3.txt"), "");
  });

  teardown(() => {
    fs.rmSync(testdirectoryPath, { recursive: true });
  });

  test("should return an array of .dart files in the given directory", async () => {
    const dartFiles = await getFiles(testdirectoryPath, ".dart");
    assert.strictEqual(dartFiles.length, 2);
    assert.strictEqual(dartFiles.includes("file1.dart"), true);
    assert.strictEqual(dartFiles.includes("file2.dart"), true);
  });

  test("should ignore files not matching the given extension", async () => {
    const dartFiles = await getFiles(testdirectoryPath, ".dart");
    assert.strictEqual(dartFiles.includes("file3.txt"), false);
  });

  test("should handle non-existent directory", async () => {
    const nonExistentdirectory = path.join(testdirectoryPath, "nonexistent");

    const dartFiles = await getFiles(nonExistentdirectory, ".dart");
    assert.strictEqual(dartFiles.length, 0);
  });
});
