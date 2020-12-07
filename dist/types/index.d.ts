import { Plugin } from "esbuild";
export interface GLSLOptions {
    minify?: boolean;
}
export default function ({ minify }?: GLSLOptions): Plugin;
