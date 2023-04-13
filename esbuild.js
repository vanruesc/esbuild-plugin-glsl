import { createRequire } from "module";
import esbuild from "esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = new Date();
const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date.toDateString()}
 * ${pkg.homepage}
 * Copyright 2020 ${pkg.author.name}
 * @license ${pkg.license}
 */`;

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: "dist/index.js",
	banner: { js: banner },
	platform: "node",
	logLevel: "info",
	format: "esm",
	bundle: true,
	minify: true
});

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: "dist/index.cjs",
	banner: { js: banner },
	platform: "node",
	logLevel: "info",
	format: "cjs",
	bundle: true,
	minify: true
});
