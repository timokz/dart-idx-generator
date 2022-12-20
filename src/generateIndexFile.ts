import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { exportStatements } from './exportstatement';

/// Called when the user executes the command "dart-idx-generator.generateFile" from the command palette. 
/// Generates an index.dart file in the current folder containing all dart files in the current folder
export async function generateIndexFile() {

    // check if a workspace is open
    if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
        vscode.window.showErrorMessage('No workspace containing folders is open');
        return;
    }

    const currentFolder = vscode.workspace.workspaceFolders;

    (async () => {
        await createIndexFile(currentFolder.toString(), '.dart');
    })();
}

// Called when the user executes the command "dart-idx-generator.generateIndexFilesForAllFolders" from the command palette.
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
        await createIndexFiles(workspace, '.dart');
    })();
}

// create index files for all folders in the given workspace
async function createIndexFiles(workspace: string, fileExtension: string): Promise<void> {
    const directories = await getDirectories(workspace);

    for (const directory of directories) {
        const directoryPath = path.join(workspace, directory);
        await createIndexFile(directoryPath, fileExtension);
    }
}

// creates an index file in the given directory containing all files with the given file extension,
// and exports all subdirectories containing an index file.
// Additionally, calls itself for all subdirectories.
async function createIndexFile(directory: string, fileExtension: string): Promise<void> {
    const files = await getFiles(directory, fileExtension);
    const subdirectories = await getDirectories(directory);

    if (files.length > 0 || subdirectories.length > 0) {
        let exports = '';
        // export all files in the current directory, excluding the index file
        for (const file of files) {
            if (file !== 'index.dart') {
                exports += exportStatements[fileExtension](file);
            }
            // create index files for all subdirectories, important
            // to do this before exporting the subdirectories.
            for (const subdirectory of subdirectories) {
                await createIndexFile(path.join(directory, subdirectory), fileExtension);
            }

            // if a subdirectory contains an index file, export it in the current index file
            for (const subdirectory of subdirectories) {

                const subdirectoryPath = path.join(directory, subdirectory);
                const indexFilePath = path.join(subdirectoryPath, 'index.dart');

                console.log(indexFilePath);

                if (fs.existsSync(indexFilePath)) {
                    exports += exportStatements[fileExtension](subdirectory);
                }
            }

            // finally, write the content to the file
            const indexFileContent = `${exports}\n`;
            fs.writeFileSync(path.join(directory, 'index.dart'), indexFileContent);


        }
    }
}
// get all directories in the given workspace 
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
// get all files in the given directory with the given extension
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