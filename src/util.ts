import * as vscode from 'vscode';
import * as option from './option';

// get active terminal
export function getTermOption(terminal: Map<string, vscode.Terminal>, name: string): option.Option<vscode.Terminal> {
    let term = terminal.get(name);
    if (term !== undefined && term.exitStatus === undefined) {
        return option.some(term);
    } else {
        return option.none();
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
    terminal: Map<string, vscode.Terminal>,
    command: string,
    name: string,
    cmd: string
) {
    context.subscriptions.push(vscode.commands.registerCommand(command, () => {
        let term = getTermOption(terminal, name)
            .map(t => () => t)
            .orelse(() => {
                let term = vscode.window.createTerminal(name);
                terminal.set(name, term);
                return term;
            })();
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
