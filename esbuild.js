import { createRequire } from "module";
import esbuild from "esbuild";

const require = createRequire(import.meta.url);
const pkg = require("./package");
const date = (new Date()).toDateString();

const banner = `/**
 * ${pkg.name} v${pkg.version} build ${date}
 * ${pkg.homepage}
 * Copyright ${date.slice(-4)} ${pkg.author.name}
 * @license ${pkg.license}
 */`;

const common = {
	entryPoints: ["src/index.ts"],
	banner: { js: banner },
	platform: "node",
	logLevel: "info",
	bundle: true,
	minify: true
};

await esbuild.build(Object.assign({
	outfile: `dist/${pkg.name}.js`,
	format: "esm"
}, common)).catch(() => process.exit(1));

await esbuild.build(Object.assign({
	outfile: `dist/${pkg.name}.cjs`,
	format: "cjs"
}, common)).catch(() => process.exit(1));
