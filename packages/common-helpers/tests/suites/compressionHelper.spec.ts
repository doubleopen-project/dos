// SPDX-FileCopyrightText: 2023 HH Partners
//
// SPDX-License-Identifier: MIT

import { assert } from 'chai';
import { compress, decompress } from "../../src/compressionHelper";

const shortJson: string = `{
    "name": "John",
    "age": 30,
    "city": "New York"
}`;

const longJson: string = `{
    "state": {
		"status": "ready",
		"id": null
	},
	"results": {
		"licenses": [
			{
				"license": "MIT",
				"location": {
					"path": "index.js",
					"start_line": 4,
					"end_line": 4
				},
				"score": 100
			},
			{
				"license": "MIT",
				"location": {
					"path": "LICENSE",
					"start_line": 2,
					"end_line": 22
				},
				"score": 100
			},
			{
				"license": "MIT",
				"location": {
					"path": "package.json",
					"start_line": 10,
					"end_line": 10
				},
				"score": 100
			}
		],
		"copyrights": [
			{
				"statement": "Copyright (c) 2014 Jonathan Ong",
				"location": {
					"path": "index.js",
					"start_line": 3,
					"end_line": 3
				}
			},
			{
				"statement": "Copyright (c) 2014 Jonathan Ong me@jongleberry.com",
				"location": {
					"path": "LICENSE",
					"start_line": 4,
					"end_line": 4
				}
			}
		],
		"issues": []
	}
}`;

export default function suite(): void {
    it('Compression & decompression of a small object should return original JSON string', function() {
      const compressedObject = compress(shortJson);
      const decompressedObject = decompress(compressedObject);
      assert.strictEqual(decompressedObject, shortJson);
    });

    it('Compression & decompression of a large object should return original JSON string', function() {
      const compressedObject = compress(longJson);
      const decompressedObject = decompress(compressedObject);
      assert.strictEqual(decompressedObject, longJson);
    });
 }