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
	 * Defaults to the value of {@link https://esbuild.github.io/api/#minify} if not specified.
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
	 * The default value depends on {@link https://esbuild.github.io/api/#legal-comments} if not specified.
	 */

	preserveLegalComments?: boolean;

}

/**
 * An options wrapper function that returns the GLSL plugin.
 *
 * @param options - The options.
 * @return The plugin.
 */

function glsl(options?: GLSLOptions): Plugin {

	return {
		name: "glsl",
		setup(build: PluginBuild) {

			async function onLoad(args: OnLoadArgs): Promise<OnLoadResult> {

				const data = await load(args.path, new Map(), options?.resolveIncludes ?? true);
				data.loader = "js";

				const minify = options?.minify ?? build.initialOptions.minify ?? false;
				const preserveLegalComments = options?.preserveLegalComments ?? build.initialOptions.legalComments !== "none";

				data.contents = minify ?
					`export default \`${minifyShader(data.contents as string, preserveLegalComments)}\`` :
					`export default \`${data.contents as string}\``;

				return data;

			}

			build.onLoad({ filter: /\.(?:frag|vert|glsl|wgsl)$/ }, onLoad);

		}
	};

}

export { glsl, glsl as default };
