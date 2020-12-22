/**
 * esbuild-plugin-glsl v1.0.1 build Tue Dec 22 2020
 * https://github.com/vanruesc/esbuild-plugin-glsl
 * Copyright 2020 Raoul van Rüschen
 * @license Zlib
 */
var f=Object.create,o=Object.defineProperty,m=Object.getPrototypeOf,g=Object.prototype.hasOwnProperty,d=Object.getOwnPropertyNames,c=Object.getOwnPropertyDescriptor,a=e=>o(e,"__esModule",{value:!0}),h=(e,r)=>{a(e);for(var s in r)o(e,s,{get:r[s],enumerable:!0})},L=(e,r,s)=>{if(a(e),r&&typeof r=="object"||typeof r=="function")for(let t of d(r))!g.call(e,t)&&t!=="default"&&o(e,t,{get:()=>r[t],enumerable:!(s=c(r,t))||s.enumerable});return e},x=e=>e&&e.__esModule?e:L(o(e!=null?f(m(e)):{},"default",{value:e,enumerable:!0}),e);h(exports,{default:()=>y});var p=x(require("fs/promises"));function u(e){let r=/[ \t]*(?:(?:\/\*[\s\S]*?\*\/)|(?:\/\/.*\n))/g,s=/\s*({|}|=|\*|,|\+|\/|>|<|&|\||\[|\]|\(|\)|-|!|;)\s*/g,t=e.replace(/\r/g,"").replace(r,""),l=!1;return t=t.split(/\n+/).reduce((i,n)=>(n=n.trim().replace(/\s{2,}|\t/," "),n[0]==="#"?(l&&i.push(`
`),i.push(n,`
`),l=!1):(n=n.replace(/(else)$/m,"$1 "),i.push(n.replace(s,"$1")),l=!0),i),[]).join(""),t.replace(/\n{2,}/g,`
`)}function y({minify:e=!1}={}){return{name:"glsl",setup(r){r.onLoad({filter:/\.(?:frag|vert|glsl)$/},async s=>{let t=await p.readFile(s.path,"utf8");return{contents:e?u(t):t,loader:"text"}})}}}
