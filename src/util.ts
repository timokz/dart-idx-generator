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
    * if there is no default directory like src or lib
*/
async function findFile(workspace: string, fileExtension: string): Promise<string | undefined> {
    const specialDirectory = path.join(workspace, specialDirectories[fileExtension]);
    if (await fs.promises.stat(specialDirectory).catch(() => undefined)) {
        // special directory exists, no need to search for .ts file
        return undefined;
    }
    const files = await fs.promises.readdir(workspace);
    for (const file of files) {
        if (file.endsWith(fileExtension)) {
            return path.join(workspace, file);
        }
    }
    const directories = await fs.promises.readdir(workspace, { withFileTypes: true });
    for (const dirent of directories) {
        if (dirent.isDirectory()) {
            const result = await findFile(path.join(workspace, dirent.name), fileExtension);
            if (result) {
                return result;
            }
        }
    }
}