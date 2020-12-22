/**
 * esbuild-plugin-glsl v1.0.1 build Tue Dec 22 2020
 * https://github.com/vanruesc/esbuild-plugin-glsl
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
import{readFile as a}from"fs/promises";function l(s){let n=/[ \t]*(?:(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n))/g,i=/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g,r=s.replace(/\r/g,"").replace(n,""),o=!1;return r=r.split(/\n+/).reduce((t,e)=>(e=e.trim().replace(/\s{2,}|\t/," "),e[0]==="#"?(o&&t.push(`
`),t.push(e,`
`),o=!1):(e=e.replace(/(else)$/m,"$1 "),t.push(e.replace(i,"$1")),o=!0),t),[]).join(""),r.replace(/\n{2,}/g,`
`)}function u({minify:s=!1}={}){return{name:"glsl",setup(n){n.onLoad({filter:/\.(?:frag|vert|glsl)$/},async i=>{let r=await a(i.path,"utf8");return{contents:s?l(r):r,loader:"text"}})}}}export{u as default};
