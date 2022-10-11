// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as option from './option';
import * as conf from './config';
import * as util from './util';

const config = conf.getConfig();

var terminal: option.Option<vscode.Terminal> = option.none();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

	console.log('runner2 is now active');

	// setup terminal
	vscode.window.onDidChangeActiveTerminal(e => { terminal = option.option(e); });

	// check haskell project
	let stackproj = (await vscode.workspace.findFiles("stack.yaml")).length > 0;

	// GHCi command
	let ghci = vscode.commands.registerCommand("runner2.ghci", () => {
		let folder = option.option(vscode.workspace.workspaceFolders);
		let doc = option.option(vscode.window.activeTextEditor).map(e => e.document);
		let filename =
			folder.flatmap(f => doc
				.flatmap(d => util.isHaskell(d) ? option.some(d) : option.none<vscode.TextDocument>())
				.map(d => d.fileName.replace('' + f[0].uri.path + "/", ""))
				.map(s => `\"${s}\"`));
		if (terminal.map(t => t.name).contains("GHCi")) {
			filename.map(f => terminal.unwrap().sendText(":l " + f));
		} else {
			filename.map(f => {
				let t = vscode.window.createTerminal("GHCi");
				t.sendText(config.ghciTool + ' ' + f);
				t.show();
			});
		}
	});
	context.subscriptions.push(ghci);

	if (config.enableStackRun) {
		context.subscriptions.push(vscode.commands.registerCommand(
			"runner2.stackrun", util.simplTerm("Stack Run", "stack run")));
	}

	context.subscriptions.push(vscode.commands.registerCommand(
		"runner2.stacktest", util.simplTerm("Stack Test", "stack test")));
	context.subscriptions.push(vscode.commands.registerCommand(
		"runner2.stackbuild", util.simplTerm("Stack Build", "stack build")));

	// button setup
	let stat = util.statButton("Load GHCi", "runner2.ghci");
	context.subscriptions.push(stat);
	// button for stack project
	if (stackproj) {
		context.subscriptions.push(
			util.statButton("Stack Build", "runner2.stackbuild"),
			util.statButton("Stack Test", "runner2.stacktest"));
		if (config.enableStackRun) {
			context.subscriptions.push(util.statButton("Stack Run", "runner2.stackrun"));
		}
	}

}

// this method is called when your extension is deactivated
export function deactivate() { }