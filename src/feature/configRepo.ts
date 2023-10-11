import * as vscode from "vscode";

export function checkNameConfigDefault(): boolean {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const fileName = config.get("fileName", "index.dart");

  return fileName === "index.dart";
}

export function getEntryPoint(): string {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const entryPoint = config.get("scope", "lib/");

  return entryPoint;
}
