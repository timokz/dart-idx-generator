import * as vscode from "vscode";

export function getSetting<T>(settingName: string): T | undefined {
  return vscode.workspace
    .getConfiguration("dartIndexGenerator")
    .get(settingName);
}
