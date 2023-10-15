import * as vscode from "vscode";

export function getConfig<T>(settingName: string, defaultVal: any = null): T {
  return vscode.workspace
    .getConfiguration("dartIndexGenerator")
    .get(settingName, defaultVal);
}

export function checkExcludeConfig(): string[] {
  return getConfig("excludeDirectories", []);
}

export function checkNameConfigDefault(): boolean {
  return getConfig("fileName", "index.dart") === "index.dart";
}

export function checkEntryPointConfig(): string {
  return getConfig("entryPoint", "lib/");
}

export function checkOnSaveConfig(): boolean {
  return getConfig("generateOnSave", true);
}

export function checkSubDirectoriesConfig(): boolean {
  return getConfig("includeSubdirectories", true);
}
