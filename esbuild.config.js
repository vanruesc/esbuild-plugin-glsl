import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const esm = {
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	platform: "node",
	format: "esm",
	bundle: true,
	minify: true,
	banner
};

const cjs = {
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.cjs`,
	platform: "node",
	format: "cjs",
	bundle: true,
	minify: true,
	banner
};

export const configs = [esm, cjs];
