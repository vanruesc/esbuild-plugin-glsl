import { BuildOptions, startService } from "esbuild";
import configs from "./esbuild.config";

async function build() {

	const service = await startService();
	const t0 = Date.now();

	try {

		for(const config of configs) {

			await service.build(Object.assign({ bundle: true }, config));
			console.log(`Built ${config.outfile} in ${Date.now() - t0}ms`);

		}

	} catch(e: Error) {

		console.error(e);

	} finally {

		service.stop();

	}

}

void build();
