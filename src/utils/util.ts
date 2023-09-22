import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { checkNameConfigDefault } from "../feature/configRepo";
import { excludedDirectoriesRegex } from "./constants";
import { exportStatements, specialDirectories } from "./exportstatement";

/** Get all directories in the given workspace */
export async function getDirectories(workspace: string): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(workspace);
    const directories = files.filter((file) => {
      return fs.statSync(`${workspace}/${file}`).isDirectory();
    });
    return directories;
  } catch (error) {
    throw error;
  }
}

/** Get all files in the given directory with the given extension */
export async function getFiles(
  directory: string,
  extension: string
): Promise<string[]> | never {
  try {
    const files = await fs.promises.readdir(directory);
    const filteredFiles = files.filter((file) => file.endsWith(extension));
    return filteredFiles;
  } catch (error) {
    throw error;
  }
}

/** Get the path to the first file with the given extension in the given workspace,
 *   if there is no default directory like src or lib
 */
export async function findRoot(
  workspace: string,
  fileExtension: string
): Promise<string> {
  console.log("FINDROOT", workspace, fileExtension);
  let specialDirectory = path.join(
    workspace,
    specialDirectories[fileExtension]
  );

  while (!isRoot(workspace)) {
    console.log("FINDROOT", workspace, fileExtension, "up");
    const files = await vscode.workspace.findFiles(
      `**/*${fileExtension}`,
      excludedDirectoriesRegex,
      1
    );
    if (files.length > 0) {
      return path.dirname(files[0].fsPath);
    }
    workspace = path.dirname(workspace);
    specialDirectory = path.join(workspace, specialDirectories[fileExtension]);
  }

  throw new Error(`No ${fileExtension} file found`);
}

/** Checks for root directory */
export function isRoot(workspace: string): boolean {
  return (
    workspace === "/" || // UNIX
    /^[a-zA-Z]:\\$/.test(workspace)
  ); // Windows;
}

/** Get the folder of the currently active file */
export function getCurrentFolder(): string | undefined {
  const editor = vscode.window.activeTextEditor;
  if (
    !editor ||
    !editor.document ||
    !editor.document.uri ||
    !editor.document.uri.fsPath
  ) {
    return undefined;
  }

  const currentFile = editor.document.uri.fsPath;
  // get the WHOLE path of the current file and remove the file name
  const currentFolder = path.dirname(currentFile);

  if (!currentFolder) {
    return undefined;
  }

  console.log("GETCURRENTFOLDER: ", currentFolder);

  return currentFolder;
}

export async function selectEntryPoint() {
  const options = {
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false,
    openLabel: "Select Entry Point",
    filters: {
      "Dart Files": ["dart"],
      "All Files": ["*"],
    },
  };

  vscode.window.showInformationMessage("Select the entry point");

  const selectedFile = await vscode.window.showOpenDialog(options);

  if (selectedFile && selectedFile.length > 0) {
    const entryPointPath = selectedFile[0].fsPath;

    vscode.window.showInformationMessage(entryPointPath);
  }
}
/**
 * Returns the first workspace folder if it exists, otherwise shows an error message and returns null.
 * @returns The first workspace folder or null if none exist.
 */
export function getFirstWorkspaceFolder(): vscode.WorkspaceFolder | null {
  const { workspaceFolders } = vscode.workspace;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0];
  }
  vscode.window.showErrorMessage("No workspace containing folders is open");
  return null;
}
export function exportCurrentDirectoryFiles(
  exports: string,
  file: string,
  fileExtension: string
): string {
  if (file !== "index.dart") {
    exports += exportStatements[fileExtension](file);
  }
  return exports;
}
export function exportSubDirectories(
  exports: string,
  subdirectories: string[],
  directory: string,
  fileExtension: string
): string {
  for (const subdirectory of subdirectories) {
    const subdirectoryPath: string = path.join(directory, subdirectory);
    const indexFilePath: string = path.join(subdirectoryPath, "index.dart");

    if (fs.existsSync(indexFilePath)) {
      exports += exportStatements[fileExtension](`${subdirectory}/index.dart`);
    }
  }
  return exports;
}
export function writeIndexFile(
  exports: string,
  directory: string,
  fileExtension: string
): void {
  const fileName = checkNameConfigDefault()
    ? "index.dart"
    : path.basename(directory) + fileExtension;

  const indexFileContent = `${exports}\n`;
  fs.writeFileSync(path.join(directory, fileName), indexFileContent);
}
