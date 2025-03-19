/**
 * A comment that contains legal information.
 */

interface LegalComment {

	contents: string,
	placeholder: string

}

/**
 * Removes comments from the given source code.
 *
 * If `legalComments` is provided, legal comments will be gathered and replaced with placeholder tokens.
 *
 * @param source - The source code.
 * @param legalComments - An optional array to be filled with legal comments. Default is `null`.
 * @return The source code without comments.
 */

function stripComments(source: string, legalComments: LegalComment[] | null = null): string {

	const commentsRegExp = /(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n)/g;
	const legalCommentRegExp = /(?:\/[/*]!)|(?:@license)|(?:@preserve)/m;

	if(legalComments === null) {

		// No need to gather legal comments.
		return source.replace(commentsRegExp, "");

	}

	let id = 0;

	for(const comment of source.matchAll(commentsRegExp)) {

		if(legalCommentRegExp.test(comment[0])) {

			comment[0].replace(/\n*$/g, "");

			const placeholder = `[[LEGAL_COMMENT_${id++}]]`;

			legalComments.push({
				contents: comment[0],
				placeholder
			});

			source = source.replace(comment[0], placeholder);

		} else {

			source = source.replace(comment[0], "");

		}

	}

	return source;

}

/**
 * Minifies the given source code.
 *
 * Based on https://github.com/vwochnik/rollup-plugin-glsl
 *
 * @param source - The source code.
 * @param preserveLegalComments - Controls whether license comments should be preserved.
 * @return The minified code.
 */

export function minifyShader(source: string, preserveLegalComments: boolean): string {

	const symbolsRegExp = /\s*([{}=*,+/><&|[\]()\\!?:;-])\s*/g;
	const genericsRegExp = /(\w<\w+>)\s*(\w)/g;

	let result = source.replace(/\r/g, "");

	const legalComments: LegalComment[] = [];
	result = stripComments(result, preserveLegalComments ? legalComments : null);

	let separatedBySymbol = true;
	let wrap = false;

	result = result.split(/\n+/).reduce((acc: string[], line: string) => {

		line = line.trim().replace(/\s{2,}|\t/, " ");

		if(line.startsWith("#")) {

			if(wrap) {

				// Make sure the directive starts on a new line...
				acc.push("\n");

			}

			// ...and ends with a line break.
			acc.push(line, "\n");
			wrap = false;

		} else if(line.length > 0) {

			// Strip whitespace around symbols.
			line = line.replace(symbolsRegExp, "$1");

			// Prepend a space if there is no symbol separating this line from the previous one.
			if(!separatedBySymbol && /\w/.test(line[0])) {

				line = " " + line;

			}

			// Add a space after generic types.
			line = line.replace(genericsRegExp, "$1 $2");

			acc.push(line);
			separatedBySymbol = !/\w/.test(line[line.length - 1]);
			wrap = true;

		}

		return acc;

	}, []).join("");

	for(const legalComment of legalComments) {

		result = result.replace(legalComment.placeholder, `\n${legalComment.contents.trim()}\n`);

	}

	return result.replace(/\n{2,}/g, "\n");

}
