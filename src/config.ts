import * as vscode from 'vscode';

export type Mode = "default" | "ghci" | "stack" | "cabal";
export type ProjectTy = "none" | "stack" | "cabal";

export type Config = {
    mode: Mode,
    ghciPath: string,
    stackPath: string,
    ghciTool: (proj: ProjectTy) => string,
    enableStackRun: boolean,
};

export function getConfig(): Config {
    const config = vscode.workspace.getConfiguration();
    const ghci = config.get("runner2.ghciPath", "ghci");
    const stack = config.get("runner2.stackPath", "stack");
    const cabal = config.get("runner2.cabalPath", "cabal");
    const mode = config.get<Mode>("runner2.replTool", "default");
    const tool = (proj: ProjectTy) => {
        switch (mode) {
            case "default":
                switch (proj) {
                    case 'none': return ghci;
                    case 'stack': return stack + " repl";
                    case 'cabal': return cabal + " repl";
                }
            case "ghci": return ghci;
            case "stack": return stack + " repl";
            case "cabal": return cabal + " repl";
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
