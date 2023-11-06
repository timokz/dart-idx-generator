import * as fs from "fs";
import * as path from "path";
import { excludedDirectoriesRegex } from "../utils/constants";
import { exportStatements } from "../utils/exportstatement";
import { checkExcludeConfig, checkNameConfigDefault } from "./configRepo";
import { createIndexFile } from "./createIndexFile";

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
export function isExcludedDir(currentDir: string): boolean {
  return (excludedDirectoriesRegex.match(currentDir) ||
    checkExcludeConfig().some((dir) => {
      return currentDir.endsWith(dir) || currentDir.endsWith(`${dir}/`);
    })) as boolean;
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
export async function createIndexFilesForSubdirectories(
  subdirectories: string[],
  directory: string,
  fileExtension: string
): Promise<void> {
  for (const subdirectory of subdirectories) {
    await createIndexFile(path.join(directory, subdirectory), fileExtension);
  }
}
export function exportSubDirectories(
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
