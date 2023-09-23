import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

/**
 * Called when the user executes the command "dart-idx-generator.deleteIndexFiles" from the command palette.
 * Mainly used for testing purposes, but will work in production.
 */
export async function deleteAllIndexFiles(): Promise<void> {
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace containing folders is open");
    return;
  }
  const workspace = vscode.workspace.workspaceFolders[0].uri;

  // ask for confirmation
  //   const confirmation = await vscode.window.showWarningMessage('Are you sure you want to delete all index files?', 'Yes', 'No');
  const confirmation = "Yes"; // TODO debugging only
  if (confirmation !== "Yes") {
    return;
  }
  if (!fs.existsSync(workspace.fsPath)) {
    console.error(`Directory not found: ${workspace.fsPath}`);
    return;
  }

  deleteIndexFilesRecursively(workspace.fsPath);
}

/**
 * Recursively deletes "index.dart" files from the specified directory and its subdirectories.
 * @param directoryPath The path to the directory to start deletion from.
 */
function deleteIndexFilesRecursively(directoryPath: string): void {
  const indexPath = path.join(directoryPath, "index.dart");
  if (fs.existsSync(indexPath)) {
    fs.unlinkSync(indexPath);
    console.log(`Deleted: ${indexPath}`);
  }

  // Check subdirectories recursively
  const subdirectories = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const subdirectory of subdirectories) {
    if (subdirectory.isDirectory()) {
      const subdirectoryPath = path.join(directoryPath, subdirectory.name);
      deleteIndexFilesRecursively(subdirectoryPath);
    }
  }
}
