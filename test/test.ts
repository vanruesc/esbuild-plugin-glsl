import { build, context } from "esbuild";
import glsl from "esbuild-plugin-glsl";
import { mkdtemp, readFile, writeFile } from "fs/promises";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import * as path from "path";

const EOL = /(?:\\r\\n|\\r|\\n)/g;

/**
 * Creates a temporary project folder for test files.
 *
 * @param name - The name of the project folder.
 * @return A promise that returns the folder path.
 */

async function createProject(name: string): Promise<string> {

	return mkdtemp(path.join("test/generated", `test-${name}-`));

}

describe("ESBuild Plugin GLSL", () => {

	it("imports glsl", async() => {

		await build({
			entryPoints: ["test/src/glsl.ts"],
			outfile: "test/generated/glsl.js",
			platform: "node",
			format: "esm",
			bundle: true,
			plugins: [glsl()]
		});

		const actual = await readFile("test/generated/glsl.js", "utf8");
		const expected = await readFile("test/expected/glsl.js", "utf8");

		assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

	it("minifies glsl", async() => {

		await build({
			entryPoints: ["test/src/glsl.ts"],
			outfile: "test/generated/glsl.min.js",
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			plugins: [glsl({ minify: true })]
		});

		const actual = await readFile("test/generated/glsl.min.js", "utf8");
		const expected = await readFile("test/expected/glsl.min.js", "utf8");

		assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

	it("minifies wgsl", async() => {

		await build({
			entryPoints: ["test/src/wgsl.ts"],
			outfile: "test/generated/wgsl.min.js",
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			plugins: [glsl({
				minify: true,
				preserveLegalComments: false
			})]
		});

		const actual = await readFile("test/generated/wgsl.min.js", "utf8");
		const expected = await readFile("test/expected/wgsl.min.js", "utf8");

		assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

	it("resolves custom includes", async() => {

		const result = await build({
			entryPoints: ["test/src/include.ts"],
			outfile: "test/generated/include.js",
			platform: "node",
			format: "esm",
			bundle: true,
			logLevel: "silent",
			plugins: [glsl()]
		});

		const actual = await readFile("test/generated/include.js", "utf8");
		const expected = await readFile("test/expected/include.js", "utf8");

		assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));
		assert.equal(result.warnings.length, 1);
		assert.match(result.warnings[0].text, /missing\.glsl/);

	});

	it("preserves legal comments", async() => {

		await build({
			entryPoints: ["test/src/wgsl.ts"],
			outfile: "test/generated/wgsl-legal.min.js",
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			legalComments: "inline",
			plugins: [glsl({ minify: true })]
		});

		const actual = await readFile("test/generated/wgsl-legal.min.js", "utf8");
		const expected = await readFile("test/expected/wgsl-legal.min.js", "utf8");

		assert.equal(actual.replace(EOL, ""), expected.replace(EOL, ""));

	});

	it("updates included shaders on rebuild", async() => {

		const directory = await createProject("rebuild");
		const entry = path.join(directory, "entry.js");
		const shader = path.join(directory, "shader.glsl");
		const include = path.join(directory, "include.glsl");
		const outfile = path.join(directory, "out.js");

		await writeFile(entry, "import shader from \"./shader.glsl\";\nexport default shader;\n");
		await writeFile(shader, "#include \"include.glsl\"\nvoid main() {}\n");
		await writeFile(include, "vec3 color = vec3(1.0);\n");

		const ctx = await context({
			entryPoints: [entry],
			outfile,
			platform: "node",
			format: "esm",
			bundle: true,
			plugins: [glsl()]
		});

		await ctx.rebuild();
		await writeFile(include, "vec3 color = vec3(0.0);\n");
		await ctx.rebuild();
		await ctx.dispose();

		const actual = await readFile(outfile, "utf8");

		assert.match(actual, /vec3 color = vec3\(0\.0\)/);
		assert.doesNotMatch(actual, /vec3 color = vec3\(1\.0\)/);

	});

	it("uses current build options when a plugin instance is reused", async() => {

		const directory = await createProject("stateless");
		const entry = path.join(directory, "entry.js");
		const shader = path.join(directory, "shader.glsl");
		const firstOutfile = path.join(directory, "first.js");
		const secondOutfile = path.join(directory, "second.js");
		const plugin = glsl();

		await writeFile(entry, "import shader from \"./shader.glsl\";\nexport default shader;\n");
		await writeFile(shader, "void main() {\n\tgl_FragColor = vec4(1.0);\n}\n");

		await build({
			entryPoints: [entry],
			outfile: firstOutfile,
			platform: "node",
			format: "esm",
			bundle: true,
			minify: false,
			plugins: [plugin]
		});

		await build({
			entryPoints: [entry],
			outfile: secondOutfile,
			platform: "node",
			format: "esm",
			bundle: true,
			minify: true,
			plugins: [plugin]
		});

		const actualFirst = await readFile(firstOutfile, "utf8");
		const actualSecond = await readFile(secondOutfile, "utf8");

		assert.match(actualFirst, /gl_FragColor = vec4\(1\.0\)/);
		assert.doesNotMatch(actualFirst, /gl_FragColor=vec4\(1\.0\)/);

		assert.match(actualSecond, /gl_FragColor=vec4\(1\.0\)/);
		assert.doesNotMatch(actualSecond, /gl_FragColor = vec4\(1\.0\)/);

	});

});
