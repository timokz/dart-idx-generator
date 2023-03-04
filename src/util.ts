import * as fs from 'fs';
import * as path from 'path';
import { specialDirectories } from './exportstatement';

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
export async function getFiles(directory: string, extension: string): Promise<string[]> {
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
export async function findRoot(workspace: string, fileExtension: string): Promise<string> {
    console.log('findRoot', workspace, fileExtension);
    let specialDirectory = path.join(workspace, specialDirectories[fileExtension]);

    while (!isRoot(workspace) && !await fs.promises.stat(specialDirectory).catch(() => undefined)
        // if workspace is root, do not go up one directory
    ) {
        console.log('findRoot', workspace, fileExtension, 'up');
        workspace = path.dirname(workspace);
        if (isRoot(workspace)) {
            break;
        }
        specialDirectory = path.join(workspace, specialDirectories[fileExtension]);
    }
    if (workspace === '/') {
        // special directory does not exist, search for .ts file
        const files = await fs.promises.readdir(workspace);
        for (const file of files) {
            if (file.endsWith(fileExtension)) {
                return workspace;
            }
        }
        const directories = await fs.promises.readdir(workspace, { withFileTypes: true });
        for (const dirent of directories) {
            if (dirent.isDirectory()) {
                const result = await findRoot(path.join(workspace, dirent.name), fileExtension);
                if (result) {
                    return result;
                }
            }
        }
        throw new Error(`No ${fileExtension} file found`);
    } else {
        return specialDirectory;
    }
}

/** Checks for root directory */
export function isRoot(workspace: string): boolean {
    return workspace === '/' // UNIX
        || /^[a-zA-Z]:\\$/.test(workspace); // Windows;
}
