import { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from "esbuild";
import * as fs from "fs";
import * as util from "util";
import { minifyShader } from "./minifyShader";

/**
 * GLSL plugin options.
 */

export interface GLSLOptions {

	minify?: boolean;

	mangle?: boolean;

}

/**
 * An options wrapper function that returns the GLSL plugin.
 *
 * @param options The options.
 * @return The plugin.
 */

function glsl({ minify = false, mangle = false }: GLSLOptions = {}): Plugin {

	const readFile = util.promisify(fs.readFile);

	return {
		name: "glsl",
		setup(build: PluginBuild) {

			async function onLoad(args: OnLoadArgs): Promise<OnLoadResult> {

				const source = await readFile(args.path, "utf8");

				return {
					contents: minify ? minifyShader(source, mangle) : source,
					loader: "text"
				};

			}

			build.onLoad({ filter: /\.(?:frag|vert|glsl|wgsl)$/ }, onLoad);

		}
	};

}

export { glsl, glsl as default };
