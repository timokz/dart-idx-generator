// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dart-idx-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('dart-idx-generator.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from dart_idx_generator!');

		// check if a workspace is open
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage('No workspace is open');
			return;
		}

		// generate a dart file called index.dart with all the dart files in the current folder
		// get the current folder
		const currentFolder = vscode.workspace.workspaceFolders;

		// get the files in the current folder
		const files = vscode.workspace.findFiles('**/*.dart');

		// create the index.dart file
		const indexFile = vscode.Uri.file(`${currentFolder[0].uri.fsPath}/index.dart`);

		// create the content of the index.dart file
		let content = '';
		files.then((files) => {
			files.forEach((file) => {
				content += `export '${file.fsPath.replace(currentFolder[0].uri.fsPath, '')}';\r\n`;
			});

			// write the content to the index.dart file
			vscode.workspace.fs.writeFile(indexFile, Buffer.from(content));
		});
	});


	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
