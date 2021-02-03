import { build } from "esbuild";
import * as fs from "fs";
import * as util from "util";
import test from "ava";
import glsl from "../";

const EOL = /(?:\\r\\n|\\r|\\n)/g;
const rmdir = util.promisify(fs.rmdir);
const readFile = util.promisify(fs.readFile);

test.before((t) => {

	return rmdir("test/generated", { recursive: true });

});

test("can import glsl", (t) => {

	const config = {
		entryPoints: ["test/src/index.ts"],
		outfile: "test/generated/bundle.js",
		platform: "node",
		format: "esm",
		bundle: true,
		plugins: [glsl()]
	};

	return build(config).then(async () => {

		const actual = await readFile("test/generated/bundle.js", "utf8");
		const expected = await readFile("test/expected/bundle.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});

test("can minify glsl", (t) => {

	const config = {
		entryPoints: ["test/src/index.ts"],
		outfile: "test/generated/bundle.min.js",
		platform: "node",
		format: "esm",
		bundle: true,
		minify: true,
		plugins: [glsl({ minify: true })]
	};

	return build(config).then(async () => {

		const actual = await readFile("test/generated/bundle.min.js", "utf8");
		const expected = await readFile("test/expected/bundle.min.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});
