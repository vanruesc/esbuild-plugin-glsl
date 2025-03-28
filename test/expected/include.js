// test/src/include.glsl
var include_default = `uniform float f;

#include <something>

#ifdef GL_FRAGMENT_PRECISION_HIGH

	uniform highp sampler2D buffer;

#else

	uniform mediump sampler2D buffer;

#endif

uniform mat4 m4;
varying vec2 vUv;

/**
 * Multiline
 * comment
 */

float testInnerMacros(const in float x) {

	#ifdef MUTE_X

		return 0.0;

	#else

		return x;

	#endif

}

void main() {

	int taps = 0;

	for(int i = 0; i < SAMPLES_INT; ++i) {

		++taps; // Inline comment

	}

	// Test weird else if
	if(taps === 0) {

		gl_FragColor.r = 1.0;

	} else
	if (taps === 10) {

		gl_FragColor.g = 1.0;

	}
	else
	{
		gl_FragColor.b = 1.0;
	}

	gl_FragColor.a = (taps == 42) ? 1.0 : 0.0;

}


`;

// test/src/include.ts
console.log(include_default);
