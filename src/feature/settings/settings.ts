import * as vscode from "vscode";
import { findRoot, getCurrentFolder, getFiles } from "../../utils/util";

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

export async function selectEntryPoint2(): Promise<void> {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");
  const scope = config.get("scope", "lib/");

  if (scope === "lib/") {
    return;
  } else if (scope === "__file_picker__") {
    const selectedFolder = await vscode.window.showOpenDialog(options);

    if (selectedFolder && selectedFolder.length > 0) {
      // Update the configuration with the selected folder
      await config.update(
        "scope",
        selectedFolder[0].fsPath,
        vscode.ConfigurationTarget.Workspace
      );
    } else {
      vscode.window.showInformationMessage("No folder selected.");
    }
  } else if (scope === "__edit_settings__") {
    // Open settings.json for editing
    vscode.commands.executeCommand(
      "workbench.action.openSettings",
      "dart-idx-generator.scope"
    );
  } else {
    // Use the specified 'scope' path
    // Rest of your logic using the 'scope' path
    vscode.window.showInformationMessage(`Generating index file in: ${scope}`);
  }
}
const options: vscode.OpenDialogOptions = {
  canSelectFiles: false,
  canSelectFolders: true,
  canSelectMany: false,
  openLabel: "Select entrypoint folder to generate index file in",
};

function config() {
  return vscode.workspace.getConfiguration();
}
