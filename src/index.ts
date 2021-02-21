import { OnLoadResult, Plugin, PluginBuild } from "esbuild";
import * as fs from "fs";
import * as util from "util";
import { minifyShader } from "./minifyShader";

/**
 * GLSL plugin options.
 */

export interface GLSLOptions {

	minify?: boolean;

}

/**
 * An options wrapper function that returns the GLSL plugin.
 *
 * @param options The options.
 * @return The plugin.
 */

function glsl({ minify = false }: GLSLOptions = {}): Plugin {

	const readFile = util.promisify(fs.readFile);

	return {
		name: "glsl",
		setup(build: PluginBuild) {

			build.onLoad({ filter: /\.(?:frag|vert|glsl)$/ }, async(args): Promise<OnLoadResult> => {

				const source = await readFile(args.path, "utf8");

				return {
					contents: minify ? minifyShader(source) : source,
					loader: "text"
				};

			});

		}
	};

}

export { glsl, glsl as default };
