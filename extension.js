// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "go-imports-alphabetical" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('go-imports-alphabetical.sortImportsInAlphabetical', sortImportsInAlphabetical);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

function info(...args) {
	vscode.window.showInformationMessage(...args)
}

function warn(...args) {
	vscode.window.showWarningMessage(...args)
}

function error(...args) {
	vscode.window.showErrorMessage(...args)
	console.error(...args)
}

function fatal(...args) {
	console.error(...args)
}

function debug(...args) {
	console.log(...args)
}

const regex = new RegExp("(import\\s*\\()([\\s\\S]+?)(\\))")

function sortImportsInAlphabetical() {
	try {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			error("no activated editor")
			return
		}
		const document = editor.document
		const text = document.getText()
		const matchResult = text.match(regex)
		if (!matchResult) {
			error("no go imports found")
			return
		}
		const pendingPackages = matchResult[2].split("\n")
		let packages = []
		for (let i in pendingPackages) {
			const val = pendingPackages[i].trim()
			if (val.length == 0) continue
			packages.push(pendingPackages[i])
		}
		packages = packages.sort()
		let newImportCode = matchResult[1]
		newImportCode += "\n"
		for (let val of packages) {
			newImportCode += val
			newImportCode += "\n"
		}
		newImportCode += matchResult[3]
		const offset = text.indexOf(matchResult[1])
		const beginPos = document.positionAt(offset)
		const endPos = document.positionAt(offset + matchResult[0].length)
		const range = new vscode.Range(beginPos, endPos)
		editor.edit((edit) => {
			edit.replace(range, newImportCode)
		})
	} catch (e) {
		fatal(e)
	}
}

module.exports = {
	activate,
	deactivate
}
