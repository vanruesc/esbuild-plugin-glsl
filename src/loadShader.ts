import * as fs from "fs";
import * as util from "util";
import * as path from "path";
import { PartialMessage } from "esbuild";

const readFile = util.promisify(fs.readFile);

/**
 * Loads and parses the given GLSL source code.
 *
 * Based on https://github.com/ricardomatias/esbuild-plugin-glsl-include
 *
 * @param filePath The path of the file.
 * @param cache A map to avoid unnecessary file loads.
 * @return An object that contains:
 * * source: the parsed code
 * * warnings: any log messages generated during path resolution and a set of watch files.
 * * watchFiles: additional file system paths for esbuild's watch mode to scan.
 */

export async function load(filePath: string, cache: Map<string, string>)
	: Promise<{source: string;warnings: PartialMessage[], watchFiles: Set<string>}> {

	let source = await readFile(filePath, "utf8");

	const includes = new Array<{file: string, contents: string, target:string}>();
	const warnings = new Array<PartialMessage>();
	const watchFiles = new Set<string>();

	cache.set(filePath, source);

	const importPattern = /#include ["']([.\\\/\w_-]+)["']/gi;

	let match = importPattern.exec(source);
	while(match !== null) {

		const pragma = match[0];
		const filename = match[1];
		const file = path.join(path.dirname(filePath), filename);

		try {

			let contents = cache.get(file);
			if(contents === undefined) {

				const inner = await load(file, cache);

				inner.warnings.forEach((w) => warnings.push(w));
				inner.watchFiles.forEach((w) => watchFiles.add(w));

				contents = inner.source;
				cache.set(file, inner.source);

			}

			includes.push({
				file,
				contents,
				target: pragma
			});

			watchFiles.add(file);

			match = importPattern.exec(source);

		} catch(err) {

			if(match === null) { continue; }
			const lines = source.split(/\r|\n|\r\n/g);
			const lineIndex = lines.indexOf(match[0]);
			const lineText = lines[lineIndex];

			warnings.push({
				text: `File from <${match[0]}> not found`,
				location: {
					file: filename,
					line: lineIndex + 1,
					length: filename.length,
					column: lineText.indexOf(filename),
					lineText
				}
			});

			includes.push({
				file,
				contents: "",
				target: match[0]
			});

			match = importPattern.exec(source);

		}

	}

	for(let index = 0; index < includes.length; index++) {

		const include = includes[index];
		source = source.replace(include.target, include.contents);

	}

	return { source, warnings, watchFiles };

}
