import * as vscode from 'vscode';

export type Config = {
    stackPath: string,
    ghciTool: string,
    enableStackRun: boolean,
};

export function getConfig(): Config {
    const config = vscode.workspace.getConfiguration();
    let stack = config.get("runner2.stackPath", "stack");
    let repl = config.get("runner2.stackRepl", false);
    return {
        stackPath: stack,
        ghciTool: repl ? (stack + " repl") : "ghci",
        enableStackRun: config.get("runner2.stackRun", false)
    };
}
