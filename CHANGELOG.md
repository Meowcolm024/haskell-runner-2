# Change Log

All notable changes to the *Haskell Runner 2* will be documented in this file.

## [Unreleased]

- nil

## [0.4.0] (not yet released)

- avoid reusing recovered terminal at startup by keeping track of active terminals created by Haskell Runner 2
- `Stack Run` button can now be hot loaded, but disabling still requires reload
- remove activate on `Cabal` language

## [0.3.0]

- **!! config and command name changes !!**
- reuse terminal by default
- added `cabal repl/build/test` support in cabal project
- extension now starts on a `*.cabal` file

## [0.2.1]

- fix potential path issue on Windows

## [0.2.0]

- support for custom ghci path
- support for sending selected code to ghci
- add keybindings for `Send to GHCi` (shortcut: `ctrl+alt+right`)
- allow dynamically choose tool for `ghci`
- rename config `stackRepl` to `replTool`

## [0.1.3]

- fix typo
- use absolute path for GHCi
- add activation event (in a stack project)
- change behavior of `Load GHCi` when not in a Haskell file

## [0.1.2]

- fix stack path issue
- fix type
- update description

## [0.1.1]

- fix config
- update GHCi

## [0.1.0]

- Initial release
