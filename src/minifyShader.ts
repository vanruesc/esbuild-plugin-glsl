/**
 * Minifies the given GLSL source code.
 *
 * Based on https://github.com/vwochnik/rollup-plugin-glsl
 *
 * @param source The source code.
 * @return The minified code.
 */

export function minifyShader(source: string, legalComments: boolean): string {

	const commentsRegExp = /[ \t]*(?:(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n))/g;
	const symbolsRegExp = /\s*([{}=*,+/><&|[\]()\\!?:;-])\s*/g;
	const genericsRegExp = /(\w<\w+>)\s*(\w)/g;
	let preservedLegalComments: { comment: string; placeholder: string; }[] = [];

	let result = source.replace(/\r/g, "");

	// Preserve legal comments to be restored at the end, if requested
	if(legalComments) {

		const preserved = preserveLegalComments(result);
		result = preserved.text;
		preservedLegalComments = preserved.comments;

	}

	result = result.replace(commentsRegExp, "");

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

	// Restore preserved legal comments, if requested
	if(legalComments) {

		for(const legalComment of preservedLegalComments) {

			result = result.replace(legalComment.placeholder, `\n${legalComment.comment}`);

		}

	}


	return result.replace(/\n{2,}/g, "\n");

}

// Finds legal comments and replaces them with placeholder text
function preserveLegalComments(text: string) {

	const legalComments = [];

	// Get all statement-level comments
	const comments = text.matchAll(/^[ \t]*(?:(?:\/\/.*$)|(?:\/\*[\s\S]*?\*\/$))/gm);

	let i = 0;

	for(const comment of comments) {

		if(/^[ \t]*\/[/*]!/gm.test(comment[0]) || comment[0].includes("@license") || comment[0].includes("@preserve")) {

			const placeholder = `__LEGAL_COMMENT_${i}__`;
			legalComments.push({
				"comment": comment[0],
				placeholder
			});
			text = text.replace(comment[0], placeholder);
			i++;

		}

	}

	return {
		text,
		comments: legalComments
	};

}
