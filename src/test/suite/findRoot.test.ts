import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import { findRoot } from "../../utils/util";

const tempDir = "__temp__";
const fileExtension = ".dart";
const specialDirectory = "lib";
const tempPath = path.join(process.cwd(), tempDir);

suite("findRoot Tests", () => {
  suiteSetup(() => {
    fs.mkdirSync(tempPath);
  });

  suiteTeardown(() => {
    fs.rmdirSync(tempPath, { recursive: true });
  });

  test("should return the special directory when it exists", async () => {
    fs.mkdirSync(path.join(tempPath, specialDirectory));

    const root = await findRoot(tempPath, fileExtension);

    console.log("ROOT", root);
    assert.strictEqual(root, path.join(tempPath, specialDirectory));
  });

  test("should return the root directory when the special directory does not exist and a file with the given extension exists in the root", async () => {
    fs.writeFileSync(path.join(tempPath, `test${fileExtension}`), "");

    const root = await findRoot(tempPath, fileExtension);
    assert.strictEqual(root, tempPath);
  });

  test("should return the root directory when the special directory does not exist and a file with the given extension exists in a subdirectory", async () => {
    const subdir = "subdir";
    fs.mkdirSync(path.join(tempPath, subdir));
    fs.writeFileSync(path.join(tempPath, subdir, `test${fileExtension}`), "");

    const root = await findRoot(tempPath, fileExtension);
    assert.strictEqual(root, tempPath);
  });
});
