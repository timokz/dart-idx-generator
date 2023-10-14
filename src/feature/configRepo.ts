import exp = require("constants");
import * as vscode from "vscode";

export function checkNameConfigDefault(): boolean {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const fileName = config.get("fileName", "index.dart");

  return fileName === "index.dart";
}

export function checkEntryPointConfig(): string {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const entryPoint = config.get("entryPoint", "lib/");

  return entryPoint;
}

export function checkOnSaveConfig(): boolean {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const onSave = config.get("generateOnSave", true);

  return onSave;
}
