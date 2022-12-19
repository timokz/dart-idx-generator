import * as vscode from 'vscode';

/// Called when the user executes the command "dart-idx-generator.generateFile" from the command palette. 
/// Generates an index.dart file in the current folder containing all dart files in the current folder
export function generateIndexFile() {

    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders) {
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
