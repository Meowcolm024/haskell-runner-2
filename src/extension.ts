// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as option from './option';
import * as conf from './config';
import * as util from './util';

// configuration
var config: conf.Config = conf.getConfig();
// current terminal
var terminal: option.Option<vscode.Terminal> = option.none();

// I'm not sure if we can do `async` here
export async function activate(context: vscode.ExtensionContext) {
    // setup terminal
    vscode.window.onDidChangeActiveTerminal(e => { terminal = option.option(e); });
    // update config
    vscode.workspace.onDidChangeConfiguration(e => { config = conf.getConfig(); });
    // check stack/cabal project
    let hasConf = async (f: string) => (await vscode.workspace.findFiles(f)).length > 0;
    let project: conf.ProjectTy = (await hasConf("stack.yaml")) ? "stack" : (await hasConf("*.cabal") ? "cabal" : "none");
    let inproject = project !== "none";

    // GHCi command
    const ghci = vscode.commands.registerCommand("runner2.ghci", () => {
        // get current file name
        let filename = option.option(vscode.window.activeTextEditor)
            .map(e => e.document)
            .flatmap(option.filterOption(util.isHaskell))
            .map(s => `\"${s.fileName}\"`);
        // currently at GHCi
        const term = terminal.flatmap(option.filterOption(t => t.name === "GHCi"))
            .or(util.getTermOption("GHCi")).map(term => () => {
                filename
                    .map(f => f.split("\\").join("\\\\"))   // windows path may contain backslash
                    .map(f => term.sendText(inproject ? ":r" : (":l " + f)));
                return term;
            }).orelse(() => {
                let term = vscode.window.createTerminal("GHCi");
                term.sendText(config.ghciTool(project) + " " + (inproject ? "" : filename.orelse("")));
                return term;
            });
        term().show();
    });
    context.subscriptions.push(ghci);

    // send selected code to GHCi
    const sendGhci = vscode.commands.registerCommand("runner2.sendGhci", () =>
        option.option(vscode.window.activeTextEditor)
            .map(e => e.document.getText(
                new vscode.Range(e.selection.start, e.selection.end)))
            .flatmap(option.filterOption(x => x.trim() !== ""))
            .map(s => ":{\n" + s + "\n:}\n")            // in case of multi-line selection
            .map(s => {
                const term = terminal.flatmap(option.filterOption(t => t.name === "GHCi"))
                    .or(util.getTermOption("GHCi")).map(term => () => term).orelse(() => {
                        let term = vscode.window.createTerminal("GHCi");
                        term.sendText(config.ghciTool(project));     // we're not loading the file here
                        return term;
                    })();
                term.sendText(s);
                term.show();
            })
    );
    context.subscriptions.push(sendGhci);

    // button for ghci
    util.resgisterStatButton(context, "Load GHCi", "runner2.ghci");

    const setupProject = (project: string, path: string) => {
        // setup commands
        util.registerSimplTerm(context, "runner2.hstest", project + " Test", path + " test");
        util.registerSimplTerm(context, "runner2.hsbuild", project + " Build", path + " build");
        util.registerSimplTerm(context, "runner2.hsrun", project + " Run", path + " run");
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
            util.registerPrompt(context, "runner2.hstest", "Not in a stack/cabal project!");
            util.registerPrompt(context, "runner2.hsbuild", "Not in a stack/cabal project!");
            util.registerPrompt(context, "runner2.hsrun", "Not in a stack/cabal project!");
            break;
    }

}

// this method is called when your extension is deactivated
export function deactivate() { }
