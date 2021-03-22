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

const configs = [{
	outfile: `dist/${pkg.name}.js`,
	format: "esm"
}, {
	outfile: `dist/${pkg.name}.cjs`,
	format: "cjs"
}];

for(const c of configs) {

	void esbuild.build(Object.assign(c, common));

}
