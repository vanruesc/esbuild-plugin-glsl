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
	platform: "node",
	bundle: true,
	minify: true,
	banner
};

const configs = [{
	outfile: `dist/${pkg.name}.js`,
	format: "esm"
}, {
	outfile: `dist/${pkg.name}.cjs`,
	format: "cjs"
}];

const t0 = Date.now();

await Promise.all(configs.map(c => esbuild.build(Object.assign(c, common))
	.then(() => console.log(`Built ${c.outfile} in ${Date.now() - t0}ms`))
	.catch(() => process.exit(1))));
