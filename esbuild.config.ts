import { BuildOptions } from "esbuild";
import * as pkg from "./package.json";

const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const ext = new Map([
	["esm", ".esm.js"],
	["cjs", ".js"]
]);

function config(format: string, minify = false): BuildOptions {

	return {
		entryPoints: ["src/index.ts"],
		outfile: `dist/${pkg.name}${ext.get(format)}`,
		platform: "node",
		banner,
		minify,
		format
	} as BuildOptions;

}

export default [
	config("esm", true),
	config("cjs", true)
];
