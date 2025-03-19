import { OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from "esbuild";
import { minifyShader } from "./minifyShader.js";
import { load } from "./loadShader.js";

/**
 * GLSL plugin options.
 */

export interface GLSLOptions {

	/**
	 * Enables or disables shader minification.
	 *
	 * @defaultValue false
	 */

	minify?: boolean;

	/**
	 * Enables or disables shader include resolution.
	 *
	 * When enabled, shaders can be included with the custom `#include "path"` directive.
	 *
	 * @defaultValue true
	 */

	resolveIncludes?: boolean;

	/**
	 * Enables or disables preservation of legal comments.
	 *
	 * Legal comments either start with `//!` or `/*!` or include `@license` or `@preserve`.
	 *
	 * @defaultValue true
	 */

	preserveLegalComments?: boolean;

}

/**
 * An options wrapper function that returns the GLSL plugin.
 *
 * @param options - The options.
 * @return The plugin.
 */

function glsl({
	minify = false,
	resolveIncludes = true,
	preserveLegalComments = true
}: GLSLOptions = {}): Plugin {

	const cache = new Map<string, string>();

	return {
		name: "glsl",
		setup(build: PluginBuild) {

			async function onLoad(args: OnLoadArgs): Promise<OnLoadResult> {

				let { contents, warnings, watchFiles } = await load(args.path, cache, resolveIncludes);
				contents = minify
					? `export default \`${minifyShader(contents as string, preserveLegalComments)}\``
					: `export default \`${contents as string}\``;
				return {
					contents,
					warnings,
					watchFiles,
					loader: "js"
				};

			}

			build.onLoad({ filter: /\.(?:frag|vert|glsl|wgsl)$/ }, onLoad);

		}
	};

}

export { glsl, glsl as default };
