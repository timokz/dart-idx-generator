import { expect } from "chai";
import { excludedFilesRegex } from "../utils/constants";

const files = [
  "fileName.g.dart",
  "otherFile.dart",
  "example.g.dart",
  "test.dart",
];

const filteredFiles = files.filter((file) => file.match(excludedFilesRegex));
console.log(filteredFiles);

describe("test excludeFiles regex", () => {
  it("should return the list wihtout .g files", () => {
    const filteredFiles = files.filter((file) =>
      file.match(excludedFilesRegex)
    );

    expect(filteredFiles).to.eql(["otherFile.dart", "test.dart"]);
  });
});
