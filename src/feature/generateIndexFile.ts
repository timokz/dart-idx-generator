import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { excludedDirectoriesRegex } from "../utils/constants";
import { exportStatements } from "../utils/exportstatement";
import { getCurrentDirectory, getDirectories, getFiles } from "../utils/util";
import {
  checkEntryPointConfig,
  checkExcludeConfig,
  checkNameConfigDefault,
  checkSubDirectoriesConfig,
} from "./configRepo";

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

function getFirstWorkspaceDirectory(): vscode.WorkspaceFolder | null {
  const { workspaceFolders } = vscode.workspace;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0];
  }
  vscode.window.showErrorMessage("No workspace containing directories is open");
  return null;
}

/**
 * Creates index files for all directories in the given workspace
 */
async function createIndexFiles(
  workspace: string,
  fileExtension: string
): Promise<void> {
  const entryPoint = checkEntryPointConfig();
  console.log("WORKSPACE", workspace);
  const directories = await getDirectories(path.join(workspace, entryPoint));

  for (const directory of directories) {
    const directoryPath = path.join(workspace, directory);
    console.log("DIRECTORY PATH", directoryPath);
    await createIndexFile(directoryPath, fileExtension);
  }
}

/**
 * Creates an index file in the given directory containing all files with the given file extension.
 * Exports all subdirectories containing an index file.
 * Additionally, calls itself for all subdirectories.
 */
async function createIndexFile(
  directory: string,
  fileExtension: string
): Promise<void> {
  console.log("CREATE INDEX FILE", directory);
  const files = await getFiles(directory, fileExtension);
  const subdirectories = await getDirectories(directory);

  console.log("FILES", files);

  if (files.length > 0 || subdirectories.length > 0) {
    let exports = "";

    for (const file of files) {
      exports = exportCurrentDirectoryFiles(exports, file, fileExtension);
    }

    if (checkSubDirectoriesConfig()) {
      await createIndexFilesForSubdirectories(
        subdirectories,
        directory,
        fileExtension
      );
    }

    exports = exportSubDirectories(
      exports,
      subdirectories,
      directory,
      fileExtension
    );

    writeIndexFile(exports, directory, fileExtension);
  }
}

function exportCurrentDirectoryFiles(
  exports: string,
  file: string,
  fileExtension: string
): string {
  if (file !== "index.dart") {
    exports += exportStatements[fileExtension](file);
  }
  return exports;
}

async function createIndexFilesForSubdirectories(
  subdirectories: string[],
  directory: string,
  fileExtension: string
): Promise<void> {
  for (const subdirectory of subdirectories) {
    await createIndexFile(path.join(directory, subdirectory), fileExtension);
  }
}

function exportSubDirectories(
  exports: string,
  subdirectories: string[],
  directory: string,
  fileExtension: string
): string {
  for (const subdirectory of subdirectories) {
    const subdirectoryPath = path.join(directory, subdirectory);
    const indexFilePath = path.join(subdirectoryPath, "index.dart");

    if (fs.existsSync(indexFilePath)) {
      exports += exportStatements[fileExtension](`${subdirectory}/index.dart`);
    }
  }
  return exports;
}

function writeIndexFile(
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

function isExcludedDir(currentDir: string): boolean {
  if (
    excludedDirectoriesRegex.match(currentDir) ||
    checkExcludeConfig().some((dir) => {
      return currentDir.endsWith(dir) || currentDir.endsWith(`${dir}/`);
    })
  ) {
    return true;
  }
  return false;
}
