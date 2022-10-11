import * as vscode from 'vscode';
import * as option from './option';

export type Config = {
    stackPath: string,
    ghciTool: string,
    enableStackRun: boolean,
};

export function getConfig(): Config {
    const config = vscode.workspace.getConfiguration();
    function getConfOption<T>(name: string, def: T): T {
        return option.option<T>(config.get(name)).orelse(def);
    }

    let stack = getConfOption<string>("runner2.stackPath", "stack");
    let repl = getConfOption<boolean>("runner2.stackRepl", false);
    return {
        stackPath: stack,
        ghciTool: repl ? stack + " repl" : "ghci",
        enableStackRun: getConfOption<boolean>("runner2.stackRun", false)
    };
}