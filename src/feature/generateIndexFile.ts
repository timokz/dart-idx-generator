import * as vscode from "vscode";
import { getCurrentDirectory, getFiles } from "../utils/util";
import {
  createIndexFile,
  createIndexFiles,
  getFirstWorkspaceDirectory,
} from "./createIndexFile";
import { isExcludedDir } from "./generateUtils";

/**
 * Called when the user executes the command "dart-idx-generator.generateFile" from the command palette,
 * or on-save if the "dart-idx-generator.generateFileOnSave" setting is set to true.
 * Generates an index.dart file in the current directory containing all dart files in the current directory
 */

export async function generateIndexFile() {
  const workspaceDirectory = getFirstWorkspaceDirectory();
  if (!workspaceDirectory) {
    return;
  }
  const currentDirectory =
    getCurrentDirectory() || workspaceDirectory.uri.fsPath;
  if (isExcludedDir(currentDirectory)) {
    return;
  }

  const dartFiles = await getFiles(currentDirectory, ".dart");

  if (dartFiles.length === 0) {
    vscode.window.showWarningMessage("No .dart files found in this workspace.");
    return;
  }

  await createIndexFile(currentDirectory, ".dart");
}
/**
 * Called when the user executes the command "dart-idx-generator.generateIndexFilesForAllDirectories" from the command palette.
 * Generates an index file for every directory in the workspace containing dart files,
 * from the respective directory and all subdirectories
 */

export async function generateIndexFilesForAllDirectories() {
  const workspaceDirectory = getFirstWorkspaceDirectory();
  if (!workspaceDirectory) {
    return;
  }

  const workspace = workspaceDirectory.uri.fsPath;
  await createIndexFiles(workspace, ".dart");
}
