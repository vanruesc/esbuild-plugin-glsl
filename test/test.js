import esbuild from "esbuild";
import * as fs from "fs";
import * as util from "util";
import test from "ava";
import glsl from "esbuild-plugin-glsl";

const EOL = /(?:\\r\\n|\\r|\\n)/g;
const readFile = util.promisify(fs.readFile);

test("can import glsl", (t) => {

	const config = {
		entryPoints: ["test/src/index.ts"],
		outfile: "test/generated/bundle.js",
		platform: "node",
		format: "esm",
		bundle: true,
		plugins: [glsl()]
	};

	return esbuild.build(config).then(async () => {

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

	return esbuild.build(config).then(async () => {

		const actual = await readFile("test/generated/bundle.min.js", "utf8");
		const expected = await readFile("test/expected/bundle.min.js", "utf8");

		t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

});

test("can mangle glsl", (t) => {
  const config = {
    entryPoints: ["test/src/index.ts"],
    outfile: "test/generated/bundle.mangled.js",
    platform: "node",
    format: "esm",
    bundle: true,
    minify: true,
    plugins: [glsl({ minify: true, mangle: true })],
  };

  return esbuild.build(config).then(async () => {
    const actual = await readFile("test/generated/bundle.mangled.js", "utf8");
    const expected = await readFile("test/expected/bundle.mangled.js", "utf8");

    t.is(actual.replace(EOL, ""), expected.replace(EOL, ""));
  });
});
