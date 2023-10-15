// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { log } from "console";
import * as vscode from "vscode";
import { checkOnSaveConfig } from "./feature/configRepo";
import { deleteAllIndexFiles } from "./feature/deleteIndexFiles";
import {
  generateIndexFile,
  generateIndexFilesForAllDirectories,
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
      generateIndexFilesForAllDirectories
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

  vscode.workspace.onDidChangeConfiguration(async (event) => {
    log("onDidChangeConfiguration");
    if (event.affectsConfiguration("dartIndexGenerator.scope")) {
      selectEntryPoint();
    }
  });

  vscode.workspace.onDidSaveTextDocument((document) => {
    if (checkOnSaveConfig() && document.languageId === "dart") {
      generateIndexFile();
    }
  });
}

// This method is called when your extension is deactivated
export function deactivate() {
  log("deactivated extension");
}
