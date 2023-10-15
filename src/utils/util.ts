import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { excludedDirectoriesRegex, excludedFilesRegex } from "./constants";
import { exportStatements, specialDirectories } from "./exportstatement";

/** Get all directories in the given workspace */
export async function getDirectories(workspace: string): Promise<string[]> {
  try {
    const files = await fs.promises.readdir(workspace);

    console.log("GETDIRECTORIES", workspace, files);
    const directories = files.filter((file) => {
      return fs.statSync(`${workspace}/${file}`).isDirectory();
    });
    return directories;
  } catch (error) {
    throw error;
  }
}

/** Get all files in the given directory with the given extension,
 * ignoring generated files
 */
export async function getFiles(
  directory: string,
  extension: string
): Promise<string[]> | never {
  if (!fs.existsSync(directory)) {
    console.error(`Directory not found: ${directory}`);
    return [];
  }

  const files = await fs.promises.readdir(directory);
  const filteredFiles = files.filter(
    (file) => file.endsWith(extension) && excludedFilesRegex.test(file)
  );
  return filteredFiles;
}

/** Get the path to the first file with the given extension in the given workspace,
 *  if there is no default directory like src or lib
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
      dartFiles: ["dart"],
      allFiles: ["*"],
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

/**
 * Checks if the given directory or its subdirectories contain a file named "index.dart".
 * Does not check for the directories existence!
 * @param directoryPath The path to the directory to check.
 * @returns True if "index.dart" exists in the directory or its subdirectories, false otherwise.
 */
export function doesDirectoryContainIndexFile(directoryPath: string): boolean {
  const indexPath = path.join(directoryPath, "index.dart");
  if (fs.existsSync(indexPath)) {
    return true;
  }
  // Check subdirectories recursively
  const subdirectories = fs.readdirSync(directoryPath, { withFileTypes: true });
  for (const subdirectory of subdirectories) {
    if (subdirectory.isDirectory()) {
      const subdirectoryPath = path.join(directoryPath, subdirectory.name);
      if (doesDirectoryContainIndexFile(subdirectoryPath)) {
        return true;
      }
    }
  }

  return false;
}
