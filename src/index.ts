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
 * Escapes special chars that can break the shader template string.
 *
 * @param contents - The shader code.
 * @return The escaped shader code.
 */

function escapeSpecialChars(contents: string): string {

	return contents
		.replace(/\\/g, "\\\\")
		.replace(/`/g, "\\`")
		.replace(/\$\{/g, () => "\\${");

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

				const contents = minify ?
					minifyShader(data.contents as string, preserveLegalComments) :
					data.contents as string;

				data.contents = `export default \`${escapeSpecialChars(contents)}\``;

				return data;

			}

			build.onLoad({ filter: /\.(?:frag|vert|glsl|wgsl)$/ }, onLoad);

		}
	};

}

export { glsl, glsl as default };
