# Haskell Runner 2

Successor of the original `Haskell Runner`.

## Features

A simple extension to run Haskell:

- Load Haskell file/project to repl (GHCi)
- Run `stack build/test/run` inside a stack project
- Send selected Haskell code to GHCi (`ctrl+alt+right`)

## Requirements

Required: `ghc` and `stack`.

## Extension Settings

The following configurations are available:

- `runner2.ghciPath`: path for GHCi (default `ghci`)
- `runner2.stackPath`: path for stack executable (default `stack`)
- `runner2.stackRepl`: use `stack repl` instead of `ghci`, you may like to turn it on in stack projects (default `false`)
- `runner2.stackRun`: show "Stack Run" button, *reload required* (default `false`)

## Release Notes

Please refer to [ChangeLog](CHANGELOG.md).

## Issues

Please report issues on Github [Issues](https://github.com/Meowcolm024/haskell-runner-2/issues).
