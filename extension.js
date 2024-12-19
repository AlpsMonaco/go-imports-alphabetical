const vscode = require('vscode');
const { execSync } = require('child_process');

function activate(context) {
	context.subscriptions.push(vscode.commands.registerCommand('go-imports-alphabetical.sortImportsInAlphabetical',
		sortImportsInAlphabeticalDefault))
	context.subscriptions.push(vscode.commands.registerCommand('go-imports-alphabetical.sortImportsInAlphabeticalKeepEmptyLine',
		sortImportsInAlphabeticalKeepEmptyLine))
	vscode.languages.registerDocumentFormattingEditProvider('go', {
		provideDocumentFormattingEdits: formatter
	})
}

// This method is called when your extension is deactivated
function deactivate() { }

function error(...args) {
	// vscode.window.showErrorMessage(...args)
	console.error(...args)
}

function fatal(...args) {
	vscode.window.showErrorMessage(...args)
	console.error(...args)
}

function debug(...args) {
	if (vscode.workspace.getConfiguration('goImportsAlphabetical').get("printDebugLog")) console.log(...args)
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
		const name = trim(pendingPackages[i])
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

function sortImportsInAlphabeticalDefault() {
	const keepEmptyLine = vscode.workspace.getConfiguration('goImportsAlphabetical').get("keepEmptyLine")
	const ignoreImportAlias = vscode.workspace.getConfiguration('goImportsAlphabetical').get("ignoreImportAlias")
	const scrollToTop = vscode.workspace.getConfiguration('goImportsAlphabetical').get("moveToTopAfterSort")
	sortImportsInAlphabetical(keepEmptyLine, ignoreImportAlias, scrollToTop)
}

function sortImportsInAlphabeticalKeepEmptyLine() {
	const ignoreImportAlias = vscode.workspace.getConfiguration('goImportsAlphabetical').get("ignoreImportAlias")
	const scrollToTop = vscode.workspace.getConfiguration('goImportsAlphabetical').get("moveToTopAfterSort")
	sortImportsInAlphabetical(true, ignoreImportAlias, scrollToTop)
}

function trim(str) {
	if (typeof str != 'string') return ''
	return str.trim()
}

function formatter(document) {
	const keepEmptyLine = vscode.workspace.getConfiguration('goImportsAlphabetical').get("keepEmptyLine")
	const ignoreImportAlias = vscode.workspace.getConfiguration('goImportsAlphabetical').get("ignoreImportAlias")
	const preformatTool = vscode.workspace.getConfiguration('goImportsAlphabetical').get("preformatTool")
	try {
		let text = null
		try {
			text = execSync(`${preformatTool}`, { input: document.getText() }).toString()
		} catch (e) {
			error(`error running ${preformatTool}:\n` + e)
			return
		}
		let eol = "\n"
		const matchResult = text.match(regex)
		if (!matchResult) {
			return [
				vscode.TextEdit.replace(
					new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length)),
					text,
				)
			]
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
				const val = trim(pendingPackages[i])
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
		let temp = text.substring(0, offset)
		temp += newImportCode
		temp += text.substring(offset + matchResult[0].length)
		return [
			vscode.TextEdit.replace(
				new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length)),
				temp,
			)
		]
	} catch (e) {
		fatal(e)
	}
}

function sortImportsInAlphabetical(keepEmptyLine, ignoreImportAlias, scrollToTop) {
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
		debug(pendingPackages)
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
				const val = trim(pendingPackages[i])
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
		text.replace()
		const offset = text.indexOf(matchResult[1])
		const beginPos = document.positionAt(offset)
		const endPos = document.positionAt(offset + matchResult[0].length)
		const range = new vscode.Range(beginPos, endPos)
		debug(range)
		editor.edit((edit) => {
			edit.replace(range, newImportCode)
			if (scrollToTop) {
				const startPosition = new vscode.Position(0, 0)
				const newSelection = new vscode.Selection(startPosition, startPosition)
				editor.selection = newSelection
				editor.revealRange(new vscode.Range(startPosition, startPosition), vscode.TextEditorRevealType.AtTop)
			}
		}).then((b) => {
			if (b) { debug("ok") }
			else { debug("not ok") }
		}, (reason) => { debug(reason) })
	} catch (e) {
		fatal(e)
	}
}

module.exports = {
	activate,
	deactivate
}
