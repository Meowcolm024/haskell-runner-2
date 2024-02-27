import * as vscode from 'vscode';
import * as option from './option';

// get terminal
export function getTermOption(name: string): option.Option<vscode.Terminal> {
    let idx = vscode.window.terminals.findIndex((term) => term.name === name);
    if (idx === -1) {
        return option.none();
    } else {
        return option.some(vscode.window.terminals[idx]);
    }
}

// create status bar button
export function resgisterStatButton(
    context: vscode.ExtensionContext,
    name: string,
    command: string,
    align = vscode.StatusBarAlignment.Left,
    priority = 10
) {
    let stat = vscode.window.createStatusBarItem(align, priority);
    stat.text = name;
    stat.command = command;
    stat.show();
    context.subscriptions.push(stat);
}

// create a terminal and send command
export function registerSimplTerm(
    context: vscode.ExtensionContext,
    command: string,
    name: string,
    cmd: string
) {
    context.subscriptions.push(vscode.commands.registerCommand(command, () => {
        let term = getTermOption(name)
            .map(t => () => t)  // new terminal need to be created lazily
            .orelse(() => vscode.window.createTerminal(name))();    
        term.sendText(cmd);
        term.show();
    }));
}

// prompt error message
export function registerPrompt(
    context: vscode.ExtensionContext,
    command: string,
    msg: string,
) {
    context.subscriptions.push(vscode.commands.registerCommand(command,
        () => vscode.window.showErrorMessage(msg)
    ));
}

// is a haskell file
export function isHaskell(text: vscode.TextDocument): boolean {
    return text.languageId === 'haskell' || text.languageId === 'literate haskell';
}
