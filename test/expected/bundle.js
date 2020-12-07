// test/src/shader.frag
var shader_default = "#include <something>\r\n\r\n#ifdef GL_FRAGMENT_PRECISION_HIGH\r\n\r\n	uniform highp sampler2D buffer;\r\n\r\n#else\r\n\r\n	uniform mediump sampler2D buffer;\r\n\r\n#endif\r\n\r\nuniform mat4 m4;\r\nvarying vec2 vUv;\r\n\r\n/**\r\n * Multiline\r\n * comment\r\n */\r\n\r\nfloat testInnerMacros(const in float x) {\r\n\r\n	#ifdef MUTE_X\r\n\r\n		return 0.0;\r\n\r\n	#else\r\n\r\n		return x;\r\n\r\n	#endif\r\n\r\n}\r\n\r\nvoid main() {\r\n\r\n	int taps = 0;\r\n\r\n	for(int i = 0; i < SAMPLES_INT; ++i) {\r\n\r\n		++taps;\r\n\r\n	}\r\n\r\n	// Test weird else if\r\n	if(taps === 0) {\r\n\r\n		gl_FragColor.r = 1.0;\r\n\r\n	} else\r\n	if (taps === 10) {\r\n\r\n		gl_FragColor.g = 1.0;\r\n\r\n	}\r\n	else\r\n	{\r\n		gl_FragColor.b = 1.0;\r\n	}\r\n\r\n}\r\n";

// test/src/index.ts
console.log(shader_default);
