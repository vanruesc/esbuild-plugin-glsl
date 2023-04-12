import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { OnLoadResult, PartialMessage } from "esbuild";

const readFile = util.promisify(fs.readFile);
const importPattern = /#include +["']([.\\/\w-]+)["']/g;
const linebreakRegex = /\r|\n|\r\n/g;

interface ShaderInclude {

	file: string,
	contents: string,
	target: string

}

/**
 * Loads and parses the given GLSL source code.
 *
 * Based on https://github.com/ricardomatias/esbuild-plugin-glsl-include
 *
 * @param filePath - The path of the file.
 * @param cache - A collection of shader includes that have already been loaded.
 * @return An object that contains:
 * * `contents`: The parsed code.
 * * `warnings`: Any log messages generated during path resolution.
 * * `watchFiles`: Additional file system paths for esbuild's watch mode to scan.
 */

export async function load(filePath: string, cache: Map<string, string>,
	resolveIncludes: boolean): Promise<OnLoadResult> {

	let contents = await readFile(filePath, "utf8");

	if(!resolveIncludes) {

		return { contents };

	}

	const includes: ShaderInclude[] = [];
	const warnings: PartialMessage[] = [];
	const watchFiles = new Set<string>();

	cache.set(filePath, contents);

	let match = importPattern.exec(contents);
	while(match !== null) {

		const pragma = match[0];
		const fileName = match[1];
		const file = path.join(path.dirname(filePath), fileName);

		try {

			if(!cache.has(file)) {

				const inner = await load(file, cache, resolveIncludes);

				inner.warnings?.forEach((w) => warnings.push(w));
				inner.watchFiles?.forEach((w) => watchFiles.add(w));

				contents = inner.contents as string;
				cache.set(file, contents);

			}

			includes.push({
				file,
				contents,
				target: pragma
			});

			watchFiles.add(file);
			match = importPattern.exec(contents);

		} catch(err) {

			if(match === null) {

				break;

			}

			const lines = contents.split(linebreakRegex);
			const lineIndex = lines.indexOf(match[0]);
			const lineText = lines[lineIndex];

			warnings.push({
				text: `File from <${match[0]}> not found`,
				location: {
					file: fileName,
					line: lineIndex + 1,
					length: fileName.length,
					column: lineText.indexOf(fileName),
					lineText
				}
			});

			includes.push({
				file,
				contents: "",
				target: match[0]
			});

			match = importPattern.exec(contents);

		}

	}

	for(const include of includes) {

		contents = contents.replace(include.target, include.contents);

	}

	return { contents, warnings, watchFiles: [...watchFiles] };

}
