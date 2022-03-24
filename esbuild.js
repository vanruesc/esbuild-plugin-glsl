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

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.js`,
	banner: { js: banner },
	platform: "node",
	logLevel: "info",
	format: "esm",
	bundle: true,
	minify: true
}).catch(() => process.exit(1));

await esbuild.build({
	entryPoints: ["src/index.ts"],
	outfile: `dist/${pkg.name}.cjs`,
	banner: { js: banner },
	platform: "node",
	logLevel: "info",
	format: "cjs",
	bundle: true,
	minify: true
}).catch(() => process.exit(1));
