import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import { excludedDirectoriesRegex } from "../utils/constants";
import { exportStatements } from "../utils/exportstatement";
import {
  findRoot,
  getCurrentFolder,
  getDirectories,
  getFiles,
} from "../utils/util";
import {
  checkEntryPointConfig,
  checkNameConfigDefault,
  getEntryPoint,
} from "./configRepo";

/**
 * Called when the user executes the command "dart-idx-generator.generateFile" from the command palette.
 * Generates an index.dart file in the current folder containing all dart files in the current folder
 */
export async function generateIndexFile() {
  console.log("Before generateIndexFile log statement", vscode.workspace);

  const workspaceFolder = getFirstWorkspaceFolder();
  if (!workspaceFolder) {
    return;
  }

  console.log("GEN INDEX FILE", workspaceFolder);

  const currentFolder = getCurrentFolder() || workspaceFolder.uri.fsPath;
  if (excludedDirectoriesRegex.match(currentFolder)) {
    return;
  }

  const current = await findRoot(currentFolder, ".dart");

  const dartFiles = await getFiles(current, ".dart");

  if (dartFiles.length === 0) {
    vscode.window.showWarningMessage("No .dart files found in this workspace.");
    return;
  }

  await createIndexFile(current, ".dart");
}

/**
 * Called when the user executes the command "dart-idx-generator.generateIndexFilesForAllFolders" from the command palette.
 * Generates an index file for every folder in the workspace containing dart files,
 * from the respective folder and all subfolders
 */
export async function generateIndexFilesForAllFolders() {
  console.log("generateIndexFilesForAllFolders");
  const workspaceFolder = getFirstWorkspaceFolder();
  if (!workspaceFolder) {
    return;
  }

  console.log("GEN MULTIPLE INDEX FILES", workspaceFolder);

  const workspace = workspaceFolder.uri.fsPath;
  console.log("generateIndexFilesForAllFolders workspace", workspace);
  await createIndexFiles(workspace, ".dart");
}

function getFirstWorkspaceFolder(): vscode.WorkspaceFolder | null {
  const { workspaceFolders } = vscode.workspace;
  if (workspaceFolders && workspaceFolders.length > 0) {
    return workspaceFolders[0];
  }
  vscode.window.showErrorMessage("No workspace containing folders is open");
  return null;
}

/**
 * Creates index files for all folders in the given workspace
 */
async function createIndexFiles(
  workspace: string,
  fileExtension: string
): Promise<void> {
  const entryPoint = getEntryPoint();

  console.log("ENTRYPOINT", entryPoint);
  const directories = await getDirectories(path.join(workspace, entryPoint));
  const entryPoint = checkEntryPointConfig();

  console.log("ENTRY POINT", entryPoint);
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

    // Todo: configurable option to exclude subdirectories
    await createIndexFilesForSubdirectories(
      subdirectories,
      directory,
      fileExtension
    );

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
