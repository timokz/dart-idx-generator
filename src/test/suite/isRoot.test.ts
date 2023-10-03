import * as assert from "assert";
import { isRoot } from "../../utils/util";

suite("isRoot", () => {
  test("should return true for root directories", () => {
    const unixRoot = "/";
    const windowsRoot = "C:\\";

    assert.strictEqual(isRoot(unixRoot), true);
    assert.strictEqual(isRoot(windowsRoot), true);
  });

  test("should return false for non-root directories", () => {
    const nonRoot1 = "/some/directory";
    const nonRoot2 = "C:\\Users\\username\\Documents";

    assert.strictEqual(isRoot(nonRoot1), false);
    assert.strictEqual(isRoot(nonRoot2), false);
  });

  test("should return false for empty string", () => {
    const emptyString = "";

    assert.strictEqual(isRoot(emptyString), false);
  });

  test("should return false for undefined", () => {
    assert.strictEqual(isRoot(""), false);
  });
});
