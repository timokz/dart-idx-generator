// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { deleteAllIndexFiles } from "./feature/deleteIndexFiles";
import {
  generateIndexFile,
  generateIndexFilesForAllFolders,
} from "./feature/generateIndexFile";
import { selectEntryPoint } from "./utils/util";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dart-idx-generator.generateFile",
      generateIndexFile
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dart-idx-generator.generateFiles",
      generateIndexFilesForAllFolders
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dart-idx-generator.deleteIndexFiles",
      deleteAllIndexFiles
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "dartIndexGenerator.selectEntryPoint",
      selectEntryPoint
    )
  );

  vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("dartIndexGenerator.scope")) {
      selectEntryPoint();
      vscode.window.showInformationMessage(
        "dartIndexGenerator configuration changed"
      );
    }
  });
  vscode.workspace.onDidSaveNotebookDocument((event) => {
    //TODO: generate index file on save
    vscode.window.showInformationMessage("Notebook saved");
  });
}

// This method is called when your extension is deactivated
export function deactivate() {}
