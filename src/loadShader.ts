import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { OnLoadResult, PartialMessage } from "esbuild";

const readFile = util.promisify(fs.readFile);

/**
 * A container for included shader code.
 */

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
 * @param resolveIncludes - Controls whether shader includes should be inlined.
 * @return A promise that resolves with an object that contains:
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

	const importPatternRegExp = /#include +["']([.\\/\w-]+)["']/g;
	const linebreakRegExp = /\r|\n|\r\n/g;

	let match = importPatternRegExp.exec(contents);

	while(match !== null) {

		const pragma = match[0];
		const fileName = match[1];
		const file = path.join(path.dirname(filePath), fileName);

		try {

			let innerContents = cache.get(file);

			if(innerContents === undefined) {

				const inner = await load(file, cache, resolveIncludes);

				inner.warnings?.forEach((w) => warnings.push(w));
				inner.watchFiles?.forEach((w) => watchFiles.add(w));

				innerContents = inner.contents as string;
				cache.set(file, innerContents);

			}

			includes.push({
				file,
				contents: innerContents,
				target: pragma
			});

			watchFiles.add(file);
			match = importPatternRegExp.exec(contents);

		} catch(err) {

			if(match === null) {

				break;

			}

			const lines = contents.split(linebreakRegExp);
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

			match = importPatternRegExp.exec(contents);

		}

	}

	for(const include of includes) {

		contents = contents.replace(include.target, include.contents);

	}

	cache.set(filePath, contents);

	return { contents, warnings, watchFiles: [...watchFiles] };

}
