import * as assert from "assert";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import { expect } from "chai";
import * as vscode from "vscode";
import { findRoot } from "../../utils/util";
import path = require("path");

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});

describe("findRoot function", () => {
  it("should return the path to the root directory when given a valid workspace and file extension", async () => {
    const workspace = path.join(__dirname, "fixtures/valid");
    const root = await findRoot(workspace, ".dart");
    expect(root).to.be(path.join(workspace, "lib"));
  });
  // Add other test cases here
});
