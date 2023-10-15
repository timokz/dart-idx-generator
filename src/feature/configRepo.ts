import exp = require("constants");
import * as vscode from "vscode";

export function checkExcludeConfig(): string[] {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const excludes = config.get("excludeDirectories", []);

  return excludes;
}

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

export function checkSubDirectoriesConfig(): boolean {
  const config = vscode.workspace.getConfiguration("dart-idx-generator");

  const subDirectory = config.get("includeSubdirectories", true);

  return subDirectory;
}
