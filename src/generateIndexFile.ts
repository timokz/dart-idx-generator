import * as vscode from 'vscode';
let fs = require("fs");

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

            //remove *\* from beginning from beginning of the string, since its treated as an escape character
            const path = file.fsPath.replace(currentFolder[0].uri.fsPath, '').replace('\\', '');

            content += `export '${path}';\r\n`;
        });

        // write the content to the index.dart file in the current folder
        vscode.workspace.fs.writeFile(indexFile, Buffer.from(content));
    });
}

// generates an index file for every folder in the workspace containing dart files 
// from the respective folder 
export function generateIndexFilesForAllFolders() {

    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders) {
        vscode.window.showErrorMessage('No workspace containing folders is open');
        return;
    }

    let vsWorkspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // get a list of all directories containing dart files in the workspace
    const currentFolders = vscode.workspace.workspaceFolders.filter(async (folder) => {
        const files = vscode.workspace.findFiles('**/*.dart', folder.uri.fsPath);
        return (await files).length > 0;
    });

    // read contents of all folders in the workspace
    fs.readdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath).forEach((file: any) => {
        console.log(file);
    });

    // variable holding all folders containing dart files
    let dartFolders: any[] = [];

    // get every folder, including subfolders, containing dart files 
    fs.readdirSync(vscode.workspace.workspaceFolders[0].uri.fsPath, { withFileTypes: true })
        .filter((dirent: any) => dirent.isDirectory())
        .forEach((dirent: any) => {
            // only use folders, not files

            // if the folder contains a dart file, add it to the list of folders containing dart files
            if (fs.readdirSync(`${vsWorkspaceFolder}/${dirent.name}`).includes('*.dart')) {
                dartFolders.push(dirent.name);
            }

        });

    console.log(dartFolders);

    // for each folder in the workspace 
    currentFolders.forEach((folder) => {

        // get the files in the current folder
        const files = vscode.workspace.findFiles('**/*.dart');

        // create the index.dart file
        const indexFile = vscode.Uri.file(`${folder.uri.fsPath}/index.dart`);

        // create the content of the index.dart file
        let content = '';
        files.then((files) => {
            files.forEach((file) => {

                //remove *\* from beginning from beginning of the string, since its treated as an escape character
                const path = file.fsPath.replace(folder.uri.fsPath, '').replace('\\', '');

                content += `export '${path}';\r\n`;
            });

            // write the content to the index.dart file in the current folder 
            vscode.workspace.fs.writeFile(indexFile, Buffer.from(content));
        });
    });
}
