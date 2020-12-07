import { build } from "esbuild";
import * as fs from "fs";
import test from "ava";
import glsl from "../dist/esbuild-plugin-glsl.js";

test.before((t) => {

	return fs.rmdirSync("test/generated", { recursive: true });

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

		const actual = await fs.promises.readFile("test/generated/bundle.js", "utf8");
		const expected = await fs.promises.readFile("test/expected/bundle.js", "utf8");

		t.is(actual, expected);

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

		const actual = await fs.promises.readFile("test/generated/bundle.min.js", "utf8");
		const expected = await fs.promises.readFile("test/expected/bundle.min.js", "utf8");

		t.is(actual, expected);

	});

});
