import * as vscode from 'vscode';

export type Mode = "default" | "ghci" | "stack";

export type Config = {
    mode: Mode,
    ghciPath: string,
    stackPath: string,
    ghciTool: (proj: boolean) => string,
    enableStackRun: boolean,
};

export function getConfig(): Config {
    const config = vscode.workspace.getConfiguration();
    const ghci = config.get("runner2.ghciPath", "ghci");
    const stack = config.get("runner2.stackPath", "stack");
    const mode = config.get<Mode>("runner2.stackRepl", "default");
    let tool = (proj: boolean) => {
        let repl = stack + " repl";
        switch (mode) {
            case "default": return proj ? repl : ghci;
            case "ghci": return ghci;
            case "stack": return repl;
        }
    };
    return {
        mode: mode,
        ghciPath: ghci,
        stackPath: stack,
        ghciTool: tool,
        enableStackRun: config.get("runner2.stackRun", false)
    };
}
