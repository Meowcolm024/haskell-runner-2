import * as vscode from 'vscode';
import * as conf from './config';

export async function getTermOrNew(
    terminal: Map<string, vscode.Terminal>,
    name: string,
    cmd: string | undefined = undefined
): Promise<{ term: vscode.Terminal, isNew: boolean }> {
    const term = terminal.get(name);
    if (term !== undefined && term.exitStatus === undefined) {
        return { term: term, isNew: false };
    } else {
        const term = vscode.window.createTerminal(name);
        terminal.set(name, term);
        if (cmd) {
            const shell = await waitShellIntegration(term);
            shell.executeCommand(cmd);
        }
        return { term: term, isNew: true };
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
    context.subscriptions.push(vscode.commands.registerCommand(command, async () => {
        const { term, isNew } = await getTermOrNew(terminal, name, cmd);
        term.show();
        if (!isNew) {
            const shell = await waitShellIntegration(term);
            shell.executeCommand(cmd);
        }
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

// get project type
export async function getProject(): Promise<conf.ProjectTy> {
    if (await vscode.workspace.findFiles("stack.yaml")) {
        return "stack";
    } else if (await vscode.workspace.findFiles("*.cabal")) {
        return "cabal";
    } else {
        return "none";
    }
}

export async function waitShellIntegration(
    terminal: vscode.Terminal
): Promise<vscode.TerminalShellIntegration> {
    if (terminal.shellIntegration) {
        return terminal.shellIntegration;
    }
    return new Promise<vscode.TerminalShellIntegration>((resolve) => {
        const disposable =
            vscode.window.onDidChangeTerminalShellIntegration(e => {
                if (e.terminal === terminal && terminal.shellIntegration) {
                    disposable.dispose();
                    resolve(terminal.shellIntegration);
                }
            });
    });
}