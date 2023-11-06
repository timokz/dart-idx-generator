import * as path from "path";
import * as vscode from "vscode";
import { getDirectories, getFiles } from "../utils/util";
import { checkEntryPointConfig, checkSubDirectoriesConfig } from "./configRepo";
import {
  createIndexFilesForSubdirectories,
  exportCurrentDirectoryFiles,
  exportSubDirectories,
  writeIndexFile,
} from "./generateUtils";

export function getFirstWorkspaceDirectory(): vscode.WorkspaceFolder | null {
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
export async function createIndexFiles(
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
export async function createIndexFile(
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
