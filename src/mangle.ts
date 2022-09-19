import { RESERVED_IDENTIFIERS, VEC_FIELDS } from "./reserved";

const BASE_CHAR_CODE = "a".charCodeAt(0);
let counter = 0;

export function makeNewIdentifier() {

	let identifier = "";
	let number = ++counter;

	do {

		identifier =
      String.fromCharCode(BASE_CHAR_CODE + ((number - 1) % 26)) + identifier;
		number = ((number - 1) / 26) | 0;

	} while(number !== 0);

	if(isReserved(identifier)) {

		identifier = makeNewIdentifier();

	}

	return identifier;

}

const isReserved = (id:string) => RESERVED_IDENTIFIERS.has(id);


/**
 * Uniforms, attributes, reserved variables are not mangled.
 * @param id
 * @returns
 */
const isAccessedExternally = (id:string) => /^((a_|u_|gl_)|([A-Z0-9_]+$))/.test(id);


/**
 * Vector field accessors, such as `vec4.x`, or `vec4.r` are not mangled.
 * @param id
 * @returns
 */
const isVectorField = (id:string) => {

	if(id.length > 4) {

		return false;

	}

	for(let i = 0; i < id.length; ++i) {

		if(!VEC_FIELDS.has(id[i])) {

			return false;

		}

	}

	return true;

};

const identifierMapping = new Map<string, string>();


const replaceId = (id: string) => {

	let replacement = identifierMapping.get(id);

	if(!identifierMapping.has(id)) {

		if(
			isReserved(id) ||
              isAccessedExternally(id) ||
              isVectorField(id)
		) {

			replacement = id;

		} else {

			replacement = makeNewIdentifier();

		}
		identifierMapping.set(id, replacement);

	}
	return identifierMapping.get(id);

};

/**
 * Checks all words in a string and mangles the ids
 * @param source
 * @returns mangled code
 */
export const mangle = (source: string) => source.replace(/[a-zA-Z_]\w*/g, replaceId);
