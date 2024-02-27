# Haskell Runner 2

Successor of the original `Haskell Runner`.

## Features

A simple extension to run Haskell:

- Load Haskell file/project to repl (GHCi)
- *Build*, *Test* or *Run* inside a stack or cabal project
- Send selected Haskell code to GHCi (`ctrl+alt+right`)

## Requirements

Required: `ghc`, `cabal` and `stack`.

## Extension Settings

The following configurations are available:

- `runner2.ghciPath`: path for GHCi (default `ghci`)
- `runner2.stackPath`: path for stack executable (default `stack`)
- `runner2.cabalPath`: path for cabal executable (default `cabal`)
- `runner2.replTool`: by `default`, it use `ghci` in single file and use `stack repl` (or `cabal repl`) in stack project. This can be overridden by choosing other options (`ghci` for ghci only, and `stack` (or `cabal`) for stack/cabal repl only)
- `runner2.showRunButton`: show "Stack/Cabal Run" button, *reload required* (default `false`)

## Release Notes

Please refer to [ChangeLog](CHANGELOG.md).

## Issues

Please report issues on Github [Issues](https://github.com/Meowcolm024/haskell-runner-2/issues).
