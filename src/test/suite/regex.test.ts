import * as assert from "assert";
import { excludedFilesRegex } from "../../utils/constants";

suite("Excluded Files Regex Tests", () => {
  const files = [
    "fileName.g.dart",
    "otherFile.dart",
    "example.g.dart",
    "test.dart",
  ];

  test("should return the list without .g files", () => {
    const filteredFiles = files.filter((file) =>
      file.match(excludedFilesRegex)
    );

    assert.deepStrictEqual(filteredFiles, ["otherFile.dart", "test.dart"]);
  });
});
