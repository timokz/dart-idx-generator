import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { generateIndexFile, generateIndexFilesForAllFolders } from './generateIndexFile';

const testFolderUri = vscode.Uri.file(path.join(__dirname, '../test'));

describe('generateIndexFile', () => {
    it('should generate index.dart file in the given directory', async () => {
        await generateIndexFile(testFolderUri);
        const indexFilePath = path.join(testFolderUri.fsPath, 'index.dart');
        expect(fs.existsSync(indexFilePath)).toBe(true);
    });
});

describe('generateIndexFilesForAllFolders', () => {
    it('should generate index.dart file in all subdirectories of the given directory', async () => {
        await generateIndexFilesForAllFolders(testFolderUri);
        const dirs = fs.readdirSync(testFolderUri.fsPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        for (const dir of dirs) {
            const indexFilePath = path.join(testFolderUri.fsPath, dir, 'index.dart');
            expect(fs.existsSync(indexFilePath)).toBe(true);
        }
    });
});