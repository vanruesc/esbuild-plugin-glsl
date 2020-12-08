/**
 * Minifies the given GLSL source code.
 *
 * Based on https://github.com/vwochnik/rollup-plugin-glsl
 *
 * @param source The source code.
 * @return The minified code.
 */

export function minifyShader(source: string): string {

	const commentsRegExp = /[ \t]*(?:(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n))/g;
	const symbolsRegExp = /\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g;

	let result = source.replace(/\r/g, "").replace(commentsRegExp, "");
	let wrap = false;

	result = result.split(/\n+/).reduce((acc: string[], line: string) => {

		line = line.trim().replace(/\s{2,}|\t/, " ");

		if(line[0] === "#") {

			if(wrap) {

				acc.push("\n");

			}

			acc.push(line, "\n");
			wrap = false;

		} else {

			line = line.replace(/(else)$/m, "$1 ");
			acc.push(line.replace(symbolsRegExp, "$1"));
			wrap = true;

		}

		return acc;

	}, []).join("");

	return result.replace(/\n{2,}/g, "\n");

}
