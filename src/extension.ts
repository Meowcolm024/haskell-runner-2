// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as option from './option';
import * as conf from './config';
import * as util from './util';

// configuration
var config: conf.Config = conf.getConfig();
// map of saved terminals of current session
var terminal: Map<string, vscode.Terminal> = new Map();
// stack run button already initialized
var stackRunBtn: boolean = false;

// I'm not sure if we can do `async` here
export async function activate(context: vscode.ExtensionContext) {
    // check stack/cabal project
    const hasConf = async (f: string) => (await vscode.workspace.findFiles(f)).length > 0;
    let project: conf.ProjectTy = (await hasConf("stack.yaml")) ? "stack" : (await hasConf("*.cabal") ? "cabal" : "none");
    let inproject = project !== "none";
    // update config
    vscode.workspace.onDidChangeConfiguration(e => {
        config = conf.getConfig();
        if (config.showRun && !stackRunBtn) {
            switch (project) {
                case 'stack':
                    stackRunBtn = true;
                    return util.resgisterStatButton(context, "Stack Run", "runner2.hsrun");
                case 'cabal':
                    stackRunBtn = true;
                    return util.resgisterStatButton(context, "Cabal Run", "runner2.hsrun");
                default: return;
            }
        }
    });

    // GHCi command
    const ghci = vscode.commands.registerCommand("runner2.ghci", () => {
        // get current file name
        let filename = option.option(vscode.window.activeTextEditor)
            .map(e => e.document)
            .flatmap(option.filterOption(util.isHaskell))
            .map(s => `\"${s.fileName}\"`);
        // currently at GHCi
        const term = util.getTermOption(terminal, "GHCi")
            .map(term => () => {
                if (inproject) {
                    term.sendText(":r");    // reload modules in project
                } else {
                    filename
                        .map(f => f.split("\\").join("\\\\"))   // windows path may contain backslash
                        .map(f => () => term.sendText(":l " + f))
                        .orelse(() => vscode.window.showInformationMessage(
                            "Cannot load a non-Haskell file to GHCi"))();
                }
                return term;
            }).orelse(() => {
                let term = vscode.window.createTerminal("GHCi");
                term.sendText(config.ghciTool(project) + " " + (inproject ? "" : filename.orelse("")));
                terminal.set("GHCi", term);
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
                const term = util.getTermOption(terminal, "GHCi")
                    .map(term => () => { console.log(term.exitStatus, term.state); return term; })
                    .orelse(() => {
                        let term = vscode.window.createTerminal("GHCi");
                        term.sendText(config.ghciTool(project));     // we're not loading the file here
                        terminal.set("GHCi", term);
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
        util.registerSimplTerm(context, terminal, "runner2.hstest", project + " Test", path + " test");
        util.registerSimplTerm(context, terminal, "runner2.hsbuild", project + " Build", path + " build");
        util.registerSimplTerm(context, terminal, "runner2.hsrun", project + " Run", path + " run");
        // setup buttons
        util.resgisterStatButton(context, project + " Build", "runner2.hsbuild");
        util.resgisterStatButton(context, project + " Test", "runner2.hstest");
        if (config.showRun) {
            stackRunBtn = true;
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
