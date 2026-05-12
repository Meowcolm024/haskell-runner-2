// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as conf from './config';
import * as util from './util';

// configuration
var config: conf.Config = conf.getConfig();
// map of saved terminals of current session
var terminal: Map<string, vscode.Terminal> = new Map();

export async function activate(context: vscode.ExtensionContext) {
    const project = await util.getProject();

    // update config, I'm not sure if it is useful or not
    vscode.workspace.onDidChangeConfiguration(e => {
        config = conf.getConfig();
    });

    // GHCi command
    const ghci = vscode.commands.registerCommand("runner2.ghci", async () => {
        const document = vscode.window.activeTextEditor?.document;
        if (document && util.isHaskell(document)) {
            const filename = JSON.stringify(document.uri.fsPath);
            const { term, isNew } = await util.getTermOrNew(terminal, "GHCi", config.ghciTool(project));
            term.show();
            if (project === "none") {
                term.sendText(":l " + filename);
            } else if (!isNew) {
                term.sendText(":r");
            }
        } else {
            vscode.window.showInformationMessage("Cannot load a non-Haskell file to GHCi");
        }
    });
    context.subscriptions.push(ghci);

    // send selected code to GHCi
    const sendGhci = vscode.commands.registerCommand("runner2.sendGhci", async () => {
        const editor = vscode.window.activeTextEditor;
        const selected = editor?.document.getText(editor.selection);
        const { term, isNew } = await util.getTermOrNew(terminal, "GHCi", config.ghciTool(project));
        if (selected && selected.trim().length > 0) {
            term.show();
            term.sendText(":{\n" + selected + "\n:}");
        } else {
            vscode.window.showInformationMessage("Nothing to send to GHCi");
        }
    });
    context.subscriptions.push(sendGhci);

    // button for ghci
    util.resgisterStatButton(context, "Load GHCi", "runner2.ghci");

    const setupProject = (project: string, path: string) => {
        // setup commands
        util.registerSimplTerm(context, terminal, "runner2.hstest", project + " Test", path + " test");
        util.registerSimplTerm(context, terminal, "runner2.hsbuild", project + " Build", path + " build");
        util.registerSimplTerm(context, terminal, "runner2.hsrun", project + " Run", path + " run");
        // setup buttons
        util.resgisterStatButton(context, project + " Build", "runner2.hsbuild");
        util.resgisterStatButton(context, project + " Test", "runner2.hstest");
        if (config.showRun) {
            util.resgisterStatButton(context, project + " Run", "runner2.hsrun");
        }
    };

    switch (project) {
        case "stack":
            setupProject("Stack", config.stackPath);
            break;
        case "cabal":
            setupProject("Cabal", config.cabalPath);
            break;
        case "none": // default behavior
            util.registerPrompt(context, "runner2.hstest", "Not in a stack or cabal project!");
            util.registerPrompt(context, "runner2.hsbuild", "Not in a stack or cabal project!");
            util.registerPrompt(context, "runner2.hsrun", "Not in a stack or cabal project!");
            break;
    }
}

// this method is called when your extension is deactivated
export function deactivate() { }
