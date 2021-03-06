# esbuild-plugin-glsl

[![CI](https://badgen.net/github/checks/vanruesc/esbuild-plugin-glsl/main)](https://github.com/vanruesc/esbuild-plugin-glsl/actions)
[![Version](https://badgen.net/npm/v/esbuild-plugin-glsl?color=green)](https://www.npmjs.com/package/esbuild-plugin-glsl)

An [esbuild](https://esbuild.github.io/) [plugin](https://esbuild.github.io/plugins/) that adds support for `.frag`, `.vert` and `.glsl` [file imports](https://esbuild.github.io/content-types/#text) with optional shader minification.

## Installation

```sh
npm install esbuild-plugin-glsl
```

## Usage

```js
import { build } from "esbuild";
import { glsl } from "esbuild-plugin-glsl";

build({
	entryPoints: ["input.js"],
	outfile: "output.js",
	bundle: true,
	plugins: [glsl({
		minify: true
	})]
}).catch(() => process.exit(1));
```

## Contributing

Use the issue tracker to propose and discuss changes. Maintain the existing coding style. Lint and test your code.
