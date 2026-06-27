import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "fs/promises";
import { build, BuildOptions } from "esbuild";
import glsl from "esbuild-plugin-glsl";

const EOL = /(?:\\r\\n|\\r|\\n)/g;

describe("esbuild plugin GLSL", () => {

	it("can import glsl", async() => {

		const config = {
			entryPoints: ["test/src/glsl.ts"],
			outfile: "test/generated/glsl.js",
			platform: "node",
			format: "esm",
			bundle: true,
			plugins: [glsl()]
		} as BuildOptions;

		return build(config).then(async() => {

			const actual = await readFile("test/generated/glsl.js", "utf8");
			const expected = await readFile("test/expected/glsl.js", "utf8");

			assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

		});

	});

	it("can minify glsl", async() => {

		const config = {
			entryPoints: ["test/src/glsl.ts"],
			outfile: "test/generated/glsl.min.js",
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			plugins: [glsl({ minify: true })]
		} as BuildOptions;

		return build(config).then(async() => {

			const actual = await readFile("test/generated/glsl.min.js", "utf8");
			const expected = await readFile("test/expected/glsl.min.js", "utf8");

			assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

		});

	});

	it("can minify wgsl", async() => {

		const config = {
			entryPoints: ["test/src/wgsl.ts"],
			outfile: "test/generated/wgsl.min.js",
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			plugins: [glsl({ minify: true, preserveLegalComments: false })]
		} as BuildOptions;

		return build(config).then(async() => {

			const actual = await readFile("test/generated/wgsl.min.js", "utf8");
			const expected = await readFile("test/expected/wgsl.min.js", "utf8");

			assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

		});

	});

	it("can use include", async() => {

		const config = {
			entryPoints: ["test/src/include.ts"],
			outfile: "test/generated/include.js",
			platform: "node",
			format: "esm",
			bundle: true,
			plugins: [glsl()]
		} as BuildOptions;

		return build(config).then(async() => {

			const actual = await readFile("test/generated/include.js", "utf8");
			const expected = await readFile("test/expected/include.js", "utf8");

			assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

		});

	});

	it("can preserve legal comments", async() => {

		const config = {
			entryPoints: ["test/src/wgsl.ts"],
			outfile: "test/generated/wgsl-legal.min.js",
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			legalComments: "inline",
			plugins: [glsl({ minify: true })]
		} as BuildOptions;

		return build(config).then(async() => {

			const actual = await readFile("test/generated/wgsl-legal.min.js", "utf8");
			const expected = await readFile("test/expected/wgsl-legal.min.js", "utf8");

			assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

		});

	});

});
