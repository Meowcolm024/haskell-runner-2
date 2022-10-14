// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as option from './option';
import * as conf from './config';
import * as util from './util';

// configuration
const config = conf.getConfig();

var terminal: option.Option<vscode.Terminal> = option.none();

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
    // setup terminal
    vscode.window.onDidChangeActiveTerminal(e => { terminal = option.option(e); });

    // check stack project
    let stackproj = (await vscode.workspace.findFiles("stack.yaml")).length > 0;

    // GHCi command
    let ghci = vscode.commands.registerCommand("runner2.ghci", () => {
        let doc = option.option(vscode.window.activeTextEditor).map(e => e.document);
        let filename = doc
            .flatmap(d => util.isHaskell(d) ? option.some(d) : option.none<vscode.TextDocument>())
            .map(s => `\"${s.fileName}\"`);
        // currently at GHCi
        if (terminal.map(t => t.name).contains("GHCi")) {
            filename.map(f => terminal.unwrap().sendText(stackproj ? ":r" : (":l " + f)));
        } else {
            filename.map(f => {
                let t = vscode.window.createTerminal("GHCi");
                t.sendText(config.ghciTool + " " + (stackproj ? "" : f));
                t.show();
            });
        }
    });
    context.subscriptions.push(ghci);

    // stack project commands
    context.subscriptions.push(vscode.commands.registerCommand(
        "runner2.stacktest", util.simplTerm("Stack Test", config.stackPath + " test")));
    context.subscriptions.push(vscode.commands.registerCommand(
        "runner2.stackbuild", util.simplTerm("Stack Build", config.stackPath + " build")));
    context.subscriptions.push(vscode.commands.registerCommand(
        "runner2.stackrun", util.simplTerm("Stack Run", config.stackPath + " run")));

    // button setup
    context.subscriptions.push(util.statButton("Load GHCi", "runner2.ghci"));
    // button for stack project
    if (stackproj) {
        context.subscriptions.push(
            util.statButton("Stack Build", "runner2.stackbuild"),
            util.statButton("Stack Test", "runner2.stacktest")
        );
        if (config.enableStackRun) {
            context.subscriptions.push(util.statButton("Stack Run", "runner2.stackrun"));
        }
    }

}

// this method is called when your extension is deactivated
export function deactivate() { }
