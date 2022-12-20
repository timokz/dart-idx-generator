import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

/// Called when the user executes the command "dart-idx-generator.generateFile" from the command palette. 
/// Generates an index.dart file in the current folder containing all dart files in the current folder
export function generateIndexFile() {

    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace containing folders is open');
        return;
    }

    const currentFolder = vscode.workspace.workspaceFolders;

    // get the files in the current folder
    const files = vscode.workspace.findFiles('**/*.dart');

    console.log(currentFolder[0].uri.fsPath);

    // create the index.dart file
    const indexFile = vscode.Uri.file(`${currentFolder[0].uri.fsPath}/index.dart`);

    // create the content of the index.dart file
    let content = '';
    files.then((files) => {
        files.forEach((file) => {

            //remove *\* from beginning of the string, since its treated as an escape character
            const path = file.fsPath.replace(currentFolder[0].uri.fsPath, '').replace('\\', '');

            content += `export '${path}';\r\n`;
        });

        // write the content to the index.dart file in the current folder
        vscode.workspace.fs.writeFile(indexFile, Buffer.from(content));
    });
}

// generates an index file for every folder in the workspace containing dart files, 
// from the respective folder and all subfolders  
export async function generateIndexFilesForAllFolders() {

    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace containing folders is open');
        return;
    }

    // path to the workspace
    const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;

    (async () => {
        await createIndexFiles(workspace);
    })();
}

// create index files for all folders in the given workspace
async function createIndexFiles(workspace: string): Promise<void> {
    const directories = await getDirectories(workspace);

    for (const directory of directories) {
        const directoryPath = path.join(workspace, directory);
        const files = await getFiles(directoryPath, '.dart');

        const exports = files
            .map((file) => `export '${file}';`)
            .join('\n');

        const indexFileContent = `${exports}\n`;
        fs.writeFileSync(path.join(directoryPath, 'index.dart'), indexFileContent);
    }
}

// get all directories in the workspace
async function getDirectories(workspace: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(workspace, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const directories = files.filter((file) => {
                    return fs.statSync(`${workspace}/${file}`).isDirectory();
                });
                resolve(directories);
            }
        });
    });
}


async function getFiles(directory: string, extension: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(directory, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const filteredFiles = files.filter((file) => file.endsWith(extension));
                resolve(filteredFiles);
            }
        });
    });
}

