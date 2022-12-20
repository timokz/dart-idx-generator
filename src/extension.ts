// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { deleteAllIndexFiles } from './deleteIndexFiles';
import { generateIndexFile, generateIndexFilesForAllFolders } from './generateIndexFile';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'dart-idx-generator.generateFile',
			generateIndexFile
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'dart-idx-generator.generateFiles',
			generateIndexFilesForAllFolders
		)
	);

	context.subscriptions.push(
		vscode.commands.registerCommand(
			'dart-idx-generator.deleteIndexFiles',
			deleteAllIndexFiles
		)
	);

}

// This method is called when your extension is deactivated
export function deactivate() { }

