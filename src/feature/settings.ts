import * as vscode from "vscode";
import { findRoot, getCurrentFolder, getFiles } from "../utils/util";

export async function selectEntryPoint(): Promise<void> {
  const config = vscode.workspace.getConfiguration("dartIndexGenerator");

  var scope = config.get<string>("scope") || "lib/";

  const options: vscode.QuickPickOptions = {
    placeHolder: "Select the folder containing the entry point",
    canPickMany: false,
    onDidSelectItem: (item) => {
      console.log("Selected item: " + item);
      scope = item.toString();
    },
  };

  vscode.window.showOpenDialog(options).then((fileUri) => {
    if (fileUri && fileUri[0]) {
      console.log("Selected file: " + fileUri[0].fsPath);
    }
  });
  // path to the current folder, use workspace folder if no file is open
  const currentFolder =
    getCurrentFolder() ||
    (vscode.workspace.workspaceFolders &&
      vscode.workspace.workspaceFolders[0]?.uri.fsPath);

  const current = await findRoot(currentFolder || "", ".dart");

  const dartFiles = await getFiles(current, ".dart");

  if (dartFiles.length === 0) {
    vscode.window.showWarningMessage("No .dart files found in this workspace.");
    return;
  }
}

const options: vscode.OpenDialogOptions = {
  canSelectMany: false,
  openLabel: "Open",
  filters: {},
};
