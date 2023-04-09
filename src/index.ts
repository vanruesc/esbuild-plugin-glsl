import { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from "esbuild";
import { minifyShader } from "./minifyShader.js";
import { load } from "./loadShader.js";

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

	const cache = new Map<string, string>();

	return {
		name: "glsl",
		setup(build: PluginBuild) {

			async function onLoad(args: OnLoadArgs): Promise<OnLoadResult> {

				const { source, warnings, watchFiles } = await load(args.path, cache);

				return {
					contents: minify ? minifyShader(source) : source,
					warnings,
					watchFiles: [...watchFiles],
					loader: "text"
				};

			}

			build.onLoad({ filter: /\.(?:frag|vert|glsl|wgsl)$/ }, onLoad);

		}
	};

}

export { glsl, glsl as default };
