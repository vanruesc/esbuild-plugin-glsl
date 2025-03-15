import { build } from "esbuild";
import * as fs from "fs";
import * as util from "util";
import test from "ava";
import glsl from "esbuild-plugin-glsl";

const EOL = /(?:\\r\\n|\\r|\\n)/g;
const readFile = util.promisify(fs.readFile);

test("can import glsl", async(t) => {

	const config = {
		entryPoints: ["test/src/glsl.ts"],
		outfile: "test/generated/glsl.js",
		platform: "node",
		format: "esm",
		bundle: true,
		plugins: [glsl()]
	};

	return build(config).then(async() => {

		const actual = await readFile("test/generated/glsl.js", "utf8");
		const expected = await readFile("test/expected/glsl.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});

test("can minify glsl", async(t) => {

	const config = {
		entryPoints: ["test/src/glsl.ts"],
		outfile: "test/generated/glsl.min.js",
		platform: "node",
		format: "esm",
		bundle: true,
		minify: true,
		plugins: [glsl({ minify: true })]
	};

	return build(config).then(async() => {

		const actual = await readFile("test/generated/glsl.min.js", "utf8");
		const expected = await readFile("test/expected/glsl.min.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});

test("can minify wgsl", async(t) => {

	const config = {
		entryPoints: ["test/src/wgsl.ts"],
		outfile: "test/generated/wgsl.min.js",
		platform: "node",
		format: "esm",
		bundle: true,
		minify: true,
		plugins: [glsl({ minify: true, preserveLegalComments: false })]
	};

	return build(config).then(async() => {

		const actual = await readFile("test/generated/wgsl.min.js", "utf8");
		const expected = await readFile("test/expected/wgsl.min.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});

test("can use include", async(t) => {

	const config = {
		entryPoints: ["test/src/include.ts"],
		outfile: "test/generated/include.js",
		platform: "node",
		format: "esm",
		bundle: true,
		plugins: [glsl()]
	};

	return build(config).then(async() => {

		const actual = await readFile("test/generated/include.js", "utf8");
		const expected = await readFile("test/expected/include.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});

test("can preserve legal comments", async(t) => {

	const config = {
		entryPoints: ["test/src/wgsl.ts"],
		outfile: "test/generated/wgsl-legal.min.js",
		platform: "node",
		format: "esm",
		bundle: true,
		minify: true,
		legalComments: "inline",
		plugins: [glsl({ minify: true })]
	};

	return build(config).then(async() => {

		const actual = await readFile("test/generated/wgsl-legal.min.js", "utf8");
		const expected = await readFile("test/expected/wgsl-legal.min.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});
