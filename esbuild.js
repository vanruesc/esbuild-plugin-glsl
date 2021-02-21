import esbuild from "esbuild";
import { configs } from "./esbuild.config.js";

const t0 = Date.now();

await Promise.all(configs.map(c => esbuild.build(c)
	.then(r => console.log(`Built ${c.outfile} in ${Date.now() - t0}ms`))
	.catch(() => process.exit(1))));
