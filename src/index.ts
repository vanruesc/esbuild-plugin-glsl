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
	 * @defaultValue inherited from esbuild options, or false if not specified
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
	 * @defaultValue inherited from esbuild options, or true if not specified
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
	minify,
	resolveIncludes = true,
	preserveLegalComments
}: GLSLOptions = {}): Plugin {

	const cache = new Map<string, string>();

	return {
		name: "glsl",
		setup(build: PluginBuild) {

			async function onLoad(args: OnLoadArgs): Promise<OnLoadResult> {

				let { contents, warnings, watchFiles } = await load(args.path, cache, resolveIncludes);

				minify ??= build.initialOptions.minify ?? false;
				preserveLegalComments ??= build.initialOptions.legalComments !== "none";

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
