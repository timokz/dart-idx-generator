import * as vscode from 'vscode';
import * as path from 'path';
import { getDirectories, getFiles } from './util';

export async function deleteAllIndexFiles() {
    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace containing folders is open');
        return;
    }
    const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const directories = await getDirectories(workspace);
    for (const directory of directories) {
        await deleteIndexFile(path.join(workspace, directory));
    }
}

async function deleteIndexFile(directory: string): Promise<void> {
    const indexFilePath = path.join(directory, 'index.ts');
    const indexFileExists = await vscode.workspace.fs.stat(vscode.Uri.file(indexFilePath));
    if (indexFileExists) {
        await vscode.workspace.fs.delete(vscode.Uri.file(indexFilePath));
    }
    const subdirectories = await getDirectories(directory);
    for (const subdirectory of subdirectories) {
        await deleteIndexFile(path.join(directory, subdirectory));
    }
}