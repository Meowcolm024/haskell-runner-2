import * as vscode from 'vscode';

// create status bar button
export function resgisterStatButton(
    context: vscode.ExtensionContext,
    name: string,
    command: string,
    align = vscode.StatusBarAlignment.Left,
    priority = 10) {

    let stat = vscode.window.createStatusBarItem(align, priority);
    stat.text = name;
    stat.command = command;
    stat.show();
    context.subscriptions.push(stat);
}

// create a terminal and send command
export function registerSimplTerm(context: vscode.ExtensionContext, command: string, name: string, cmd: string) {
    context.subscriptions.push(vscode.commands.registerCommand(command, () => {
        let t = vscode.window.createTerminal(name);
        t.sendText(cmd);
        t.show();
    }));
}

// is a haskell file
export function isHaskell(text: vscode.TextDocument): boolean {
    return text.languageId === 'haskell' || text.languageId === 'literate haskell';
}
