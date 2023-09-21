import { log } from "console";
import * as vscode from "vscode";

export function checkNameConfig(): string {
  const config = vscode.workspace.getConfiguration("dartIndexGenerator");

  log(config.has("fileName"));

  const fileName = config.get("fileName", "index.dart");

  log("filename", fileName);
  return fileName;
}
