import * as vscode from 'vscode';

// only used by config
type Mode = "default" | "ghci" | "stack" | "cabal";
// type of current project
export type ProjectTy = "none" | "stack" | "cabal";

export type Config = {
    mode: Mode,
    ghciPath: string,
    stackPath: string,
    cabalPath: string,
    ghciTool: (proj: ProjectTy) => string,
    showRun: boolean,
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
                    case "none": return ghci;
                    case "stack": return stack + " repl";
                    case "cabal": return cabal + " repl";
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
        cabalPath: cabal,
        ghciTool: tool,
        showRun: config.get("runner2.showRunButton", false)
    };
}
