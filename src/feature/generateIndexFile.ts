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

/**  Called when the user executes the command "dart-idx-generator.generateFile" from the command palette.
 *
 * Generates an index.dart file in the current folder containing all dart files in the current folder
 */
export async function generateIndexFile() {
  // check if a workspace is open
  if (
    !vscode.workspace.workspaceFolders ||
    vscode.workspace.workspaceFolders.length === 0
  ) {
    vscode.window.showErrorMessage("No workspace containing folders is open");
    return;
  }

  const config = vscode.workspace.getConfiguration("dartIndexGenerator");
  const scope = config.get("scope", "lib/");

  // path to the current folder, use workspace folder if no file is open
  const currentFolder =
    getCurrentFolder() || vscode.workspace.workspaceFolders[0].uri.fsPath;

  // terminate if the current folder is excluded
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

/** Called when the user executes the command "dart-idx-generator.generateIndexFilesForAllFolders" from the command palette.

* Generates an index file for every folder in the workspace containing dart files, 
* from the respective folder and all subfolders  
*/
export async function generateIndexFilesForAllFolders(): Promise<void> {
  // check if a workspace is open
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage("No workspace containing folders is open");
    return;
  }

  try {
    // path to the workspace
    const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;

    (async () => {
      await createIndexFiles(workspace, ".dart");
    })();
  } catch (error) {
    vscode.window.showErrorMessage(error as string);
  }
}

/** Creates index files for all folders in the given workspace */
async function createIndexFiles(
  workspace: string,
  fileExtension: string
): Promise<void> {
  // only consider lib directory for now, consider other directories later or make it configurable
  const directories = await getDirectories(path.join(workspace, "lib"));

  for (const directory of directories) {
    const directoryPath = path.join(workspace, directory);
    await createIndexFile(directoryPath, fileExtension);
  }
}

/** Creates an index file in the given directory containing all files with the given file extension.
 *
 * Exports all subdirectories containing an index file.
 * Additionally, calls itself for all subdirectories.
 */
async function createIndexFile(
  directory: string,
  fileExtension: string
): Promise<void> {
  console.log("createIndexFile", directory, fileExtension);

  const files = await getFiles(directory, fileExtension);
  const subdirectories = await getDirectories(directory);

  if (files.length > 0 || subdirectories.length > 0) {
    let exports = "";
    // export all files in the current directory, excluding the index file
    for (const file of files) {
      if (file !== "index.dart") {
        exports += exportStatements[fileExtension](file);
      }
      // create index files for all subdirectories, important
      // to do this before exporting the subdirectories.
      for (const subdirectory of subdirectories) {
        await createIndexFile(
          path.join(directory, subdirectory),
          fileExtension
        );
      }

      // if a subdirectory contains an index file, export it in the current index file
      exports = exportSubDirs(exports);

      // finally, write the content to the file
      const indexFileContent = `${exports}\n`;
      fs.writeFileSync(path.join(directory, "index.dart"), indexFileContent);
    }
  }

  function exportSubDirs(exports: string) {
    for (const subdirectory of subdirectories) {
      const subdirectoryPath = path.join(directory, subdirectory);
      const indexFilePath = path.join(subdirectoryPath, "index.dart");

      if (fs.existsSync(indexFilePath)) {
        exports += exportStatements[fileExtension](
          `${subdirectory}/index.dart`
        );
      }
    }
    return exports;
  }
}
