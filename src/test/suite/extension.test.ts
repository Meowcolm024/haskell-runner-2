import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import * as option from '../../option';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Sample test', () => {
        assert.strictEqual(-1, [1, 2, 3].indexOf(5));
        assert.strictEqual(-1, [1, 2, 3].indexOf(0));
    });

    test('path test', () => {
        assert.notStrictEqual(
            option.some("\"C:\\hello\\world.hs\"")
                .map(f => f.split("\\").join("\\\\"))
                .map(s => ":l " + s),
            option.some(`:l "C:\\\\hello\\\\world.hs"`)
        );
    });
});
