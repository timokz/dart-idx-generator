import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { excludedDirectoriesRegex } from './constants';
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
    console.log('FINDROOT', workspace, fileExtension);
    let specialDirectory = path.join(workspace, specialDirectories[fileExtension]);

    while (!isRoot(workspace)) {
        console.log('FINDROOT', workspace, fileExtension, 'up');
        const files =
            await vscode.workspace.findFiles(`**/*${fileExtension}`, excludedDirectoriesRegex, 1);
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
    return workspace === '/' // UNIX
        || /^[a-zA-Z]:\\$/.test(workspace); // Windows;
}

/** Get the folder of the currently active file */
export function getCurrentFolder(): string | undefined {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return undefined;
    }

    const currentFile = editor.document.uri.fsPath;
    const currentFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(currentFile));

    if (!currentFolder) {
        return undefined;
    }

    console.log('GETCURRENTFOLDER: ', currentFolder.uri.fsPath);

    return currentFolder.uri.fsPath;
}
