import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getDirectories, getFiles } from './util';



export async function deleteAllIndexFiles() {
    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace containing folders is open');
        return;
    }

    // path to the workspace
    const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;

    const directories = await getDirectories(workspace);

    for (const directory of directories) {
        const directoryPath = path.join(workspace, directory);
        await deleteIndexFile(directoryPath);
    }
}

async function deleteIndexFile(directory: string): Promise<void> {
    const indexFilePath = path.join(directory, 'index.dart');
    if (fs.existsSync(indexFilePath)) {
        fs.unlinkSync(indexFilePath);
    }

    const subdirectories = await getDirectories(directory);
    for (const subdirectory of subdirectories) {
        await deleteIndexFile(path.join(directory, subdirectory));
    }
}