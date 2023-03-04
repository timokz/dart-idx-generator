import * as assert from 'assert';
import * as mocha from 'mocha';

import * as x from './findRoot.test';
// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import path = require('path');
import { findRoot } from '../../util';
import { expect } from 'chai';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

});

describe('findRoot function', () => {
	it('should return the path to the root directory when given a valid workspace and file extension', async () => {
		const workspace = path.join(__dirname, 'fixtures/valid');
		const root = await findRoot(workspace, '.dart');
		expect(root).to.be(path.join(workspace, 'lib'));
	});
	// Add other test cases here
});



