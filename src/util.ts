import * as vscode from 'vscode';

// create status bar button
export function statButton(name: string, command: string, align = vscode.StatusBarAlignment.Left, priority = 10) {
    let stat = vscode.window.createStatusBarItem(align, priority);
    stat.text = name;
    stat.command = command;
    stat.show();
    return stat;
}

// create a terminal and send command
export function simplTerm(name: string, cmd: string) {
    return () => {
        let t = vscode.window.createTerminal(name);
        t.sendText(cmd);
        t.show();
    };
}

// is a haskell file
export function isHaskell(text: vscode.TextDocument): boolean {
    return text.languageId === 'haskell' || text.languageId === 'literate haskell';
}
