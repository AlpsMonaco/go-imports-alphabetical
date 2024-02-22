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
	context.subscriptions.push(vscode.commands.registerCommand('go-imports-alphabetical.sortImportsInAlphabetical',
		sortImportsInAlphabeticalDefault))
	context.subscriptions.push(vscode.commands.registerCommand('go-imports-alphabetical.sortImportsInAlphabeticalKeepEmptyLine',
		sortImportsInAlphabeticalKeepEmptyLine))
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

function sortImports(ignoreImportAlias, imports) {
	let compareFn = null
	if (ignoreImportAlias) {
		compareFn = (a, b) => {
			let index = a.indexOf("\"")
			a = a.substring(index)
			index = b.indexOf("\"")
			b = b.substring(index)
			return a.localeCompare(b)
		}
	} else {
		compareFn = (a, b) => {
			return a.localeCompare(b)
		}
	}
	return imports.sort(compareFn)
}

function parsePackages(pendingPackages) {
	let result = []
	let start = -1
	let end = -1
	for (let i = 0; i < pendingPackages.length; i++) {
		const name = pendingPackages[i].trim()
		if (name.length != 0) {
			if (start == -1) {
				start = i
			}
			end = i
		} else {
			if (start != -1) {
				result.push([start, end + 1])
				start = -1
				end = -1
			}
		}
	}
	if (start != -1) {
		result.push([start, end + 1])
	}
	return result
}

// vscode.workspace.getConfiguration('goImportsAlphabetical').get("keepEmptyLine")
// vscode.workspace.getConfiguration('goImportsAlphabetical').get("ignoreImportAlias")

function sortImportsInAlphabeticalDefault() {
	const keepEmptyLine = vscode.workspace.getConfiguration('goImportsAlphabetical').get("keepEmptyLine")
	const ignoreImportAlias = vscode.workspace.getConfiguration('goImportsAlphabetical').get("ignoreImportAlias")
	sortImportsInAlphabetical(keepEmptyLine, ignoreImportAlias)
}

function sortImportsInAlphabeticalKeepEmptyLine() {
	const ignoreImportAlias = vscode.workspace.getConfiguration('goImportsAlphabetical').get("ignoreImportAlias")
	sortImportsInAlphabetical(true, ignoreImportAlias)
}

function sortImportsInAlphabetical(keepEmptyLine, ignoreImportAlias) {
	try {
		const editor = vscode.window.activeTextEditor
		if (!editor) {
			error("no activated editor")
			return
		}
		const document = editor.document
		let eol = document.eol == 1 ? "\n" : "\r\n"
		let text = document.getText()
		const matchResult = text.match(regex)
		if (!matchResult) {
			error("no go imports found")
			return
		}
		let pendingPackages = matchResult[2].split(eol)
		pendingPackages.shift()
		pendingPackages.pop()
		let packages = []
		if (keepEmptyLine) {
			packages = pendingPackages
			const packageGroupIndices = parsePackages(pendingPackages)
			for (let i = 0; i < packageGroupIndices.length; i++) {
				let packageTuple = packageGroupIndices[i]
				let start = packageTuple[0]
				let end = packageTuple[1]
				packages.splice(start, end - start,
					...sortImports(ignoreImportAlias, packages.slice(start, end)))
			}
		} else {
			for (let i in pendingPackages) {
				const val = pendingPackages[i].trim()
				if (val.length == 0) continue
				packages.push(pendingPackages[i])
			}
			packages = sortImports(ignoreImportAlias, packages)
		}
		let newImportCode = matchResult[1]
		newImportCode += eol
		for (let val of packages) {
			newImportCode += val
			newImportCode += eol
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
