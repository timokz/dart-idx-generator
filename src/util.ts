import * as fs from 'fs';

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