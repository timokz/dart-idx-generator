import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {
  doesDirectoryContainIndexFile,
  getDirectories,
  getRelevantDirectories,
} from "../utils/util";

/** Called when the user executes the command "dart-idx-generator.deleteIndexFiles" from the command palette. 

 * Mainly used for testing purposes, but will work in production.
*/
export async function deleteAllIndexFiles() {
  // check if a workspace is open
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace containing folders is open");
    return;
  }

  // ask for confirmation
  //   const confirmation = await vscode.window.showWarningMessage('Are you sure you want to delete all index files?', 'Yes', 'No');
  const confirmation = "Yes"; // TODO debugging only
  if (confirmation !== "Yes") {
    return;
  }

  const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;

  const directories = await getRelevantDirectories(workspace);

  console.log("DELETEALLINDEXFILES directories:", directories);

  const filteredDirectories = directories.filter((directory) =>
    doesDirectoryContainIndexFile(directory)
  );
  console.log("DELETEALLINDEXFILES filteredDirectories:", filteredDirectories);

  for (const directory of filteredDirectories) {
    const directoryPath = path.join(workspace, directory);
    await deleteIndexFile(directoryPath);
  }

  vscode.window.showInformationMessage("All index files deleted");
}

async function deleteIndexFile(directory: string): Promise<void> {
  const indexFilePath = path.join(directory, "index.dart"); // TODO configurable
  if (fs.existsSync(indexFilePath)) {
    fs.unlinkSync(indexFilePath);
  }

  const subdirectories = await getDirectories(directory);

  console.log("DELETEINDEXFILE subdirectories:", subdirectories);

  for (const subdirectory of subdirectories) {
    const subdirectoryPath = path.join(directory, subdirectory);
    await deleteIndexFile(subdirectoryPath);
  }
}
