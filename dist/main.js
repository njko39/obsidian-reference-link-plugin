/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var m=Object.defineProperty;var E=Object.getOwnPropertyDescriptor;var g=Object.getOwnPropertyNames;var k=Object.prototype.hasOwnProperty;var M=(n,t)=>{for(var s in t)m(n,s,{get:t[s],enumerable:!0})},P=(n,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of g(t))!k.call(n,o)&&o!==s&&m(n,o,{get:()=>t[o],enumerable:!(r=E(t,o))||r.enumerable});return n};var w=n=>P(m({},"__esModule",{value:!0}),n);var C={};M(C,{default:()=>h});module.exports=w(C);var x=require("obsidian"),h=class extends x.Plugin{async onload(){this.registerMarkdownPostProcessor(this.handleReferenceLinks.bind(this))}async handleReferenceLinks(t,s){let r=new Map,o=/^\[([^\]]+)\]:\s*(https?:\/\/[^\s<>"']+)/,f=[];Array.from(t.children).forEach(e=>{if(e instanceof HTMLParagraphElement||e instanceof HTMLDivElement){let a=e.innerText.match(o);if(a){let[T,c,i]=a;r.set(c,i),f.push(e)}}}),f.forEach(e=>e.remove());let p=document.createTreeWalker(t,NodeFilter.SHOW_TEXT),u=[];for(;p.nextNode();){let e=p.currentNode;/\[([^\]]+)\]/.test(e.nodeValue||"")&&u.push(e)}u.forEach(e=>{let a=e.parentElement;if(!a)return;let T=(e.nodeValue||"").split(/(\[[^\]]+\])/g),c=document.createDocumentFragment();T.forEach(i=>{let d=i.match(/^\[([^\]]+)\]$/);if(d&&r.has(d[1])){let l=document.createElement("a");l.href=r.get(d[1]),l.textContent=d[1],l.target="_blank",l.rel="noopener",c.appendChild(l)}else c.appendChild(document.createTextNode(i))}),a.replaceChild(c,e)})}};
