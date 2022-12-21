import { expect } from 'chai';
import * as fs from 'fs';
import { utils } from 'mocha';
import * as path from 'path';
import { findRoot } from '../../util';

describe('findRoot', () => {
    const tempDir = '__temp__';
    const fileExtension = '.ts';
    const specialDirectory = 'src';
    const tempPath = path.join(process.cwd(), tempDir);

    beforeEach(() => {
        // create a temporary directory
        fs.mkdirSync(tempPath);
    });

    afterEach(() => {
        // delete the temporary directory
        fs.rmdirSync(tempPath, { recursive: true });
    });

    it('should return the special directory when it exists', async () => {
        // create the special directory in the temporary directory
        fs.mkdirSync(path.join(tempPath, specialDirectory));

        const root = await findRoot(tempPath, fileExtension);
        expect(root).to.equal(path.join(tempPath, specialDirectory));
    });

    it('should return the root directory when the special directory does not exist and a file with the given extension exists in the root', async () => {
        // create a file with the given extension in the temporary directory
        fs.writeFileSync(path.join(tempPath, `test${fileExtension}`), '');

        const root = await findRoot(tempPath, fileExtension);
        expect(root).equal(tempPath);
    });

    it('should return the root directory when the special directory does not exist and a file with the given extension exists in a subdirectory', async () => {
        // create a subdirectory in the temporary directory
        const subdir = 'subdir';
        fs.mkdirSync(path.join(tempPath, subdir));
        // create a file with the given extension in the subdirectory
        fs.writeFileSync(path.join(tempPath, subdir, `test${fileExtension}`), '');

        const root = await findRoot(tempPath, fileExtension);
        expect(root).equal(tempPath);
    });
});
