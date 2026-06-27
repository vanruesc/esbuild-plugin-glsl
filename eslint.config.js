import { defineConfig } from "eslint/config";
import aether from "eslint-config-aether";

const eslintignore = {
	ignores: [
		"test/expected/**",
		"test/generated/**"
	]
};

export default defineConfig([
	eslintignore,
	aether
]);
