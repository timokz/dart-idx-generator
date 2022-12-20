import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

// get all directories in the given workspace 
export async function getDirectories(workspace: string): Promise<string[]> {
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
export async function getFiles(directory: string, extension: string): Promise<string[]> {
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