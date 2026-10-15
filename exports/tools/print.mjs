// Prints a review page to PDF, one PDF page per .pg, each sized to its content.
import { spawn } from "node:child_process"; import { mkdtempSync, writeFileSync } from "node:fs"; import { tmpdir } from "node:os"; import { join, resolve } from "node:path";
const [, , html, out] = process.argv;
const proc = spawn("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", ["--headless=new","--remote-debugging-port=9335",`--user-data-dir=${mkdtempSync(join(tmpdir(),"p-"))}`,"about:blank"],{stdio:"ignore"});
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms)); let t; for(let i=0;i<50;i++){try{t=await (await fetch("http://127.0.0.1:9335/json")).json();break}catch{await sleep(200)}}
const ws=new WebSocket(t.find(x=>x.type==="page").webSocketDebuggerUrl); await new Promise(r=>ws.addEventListener("open",r));
let id=0;const w=new Map();ws.addEventListener("message",e=>{const m=JSON.parse(e.data);if(m.id&&w.has(m.id)){w.get(m.id)(m);w.delete(m.id)}});
const send=(method,params={})=>new Promise(r=>{const n=++id;w.set(n,r);ws.send(JSON.stringify({id:n,method,params}))});
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride",{width:1400,height:1000,deviceScaleFactor:1,mobile:false});
await send("Page.navigate",{url:"file://"+resolve(html)}); await sleep(3000);
const r=await send("Runtime.evaluate",{awaitPromise:true,returnByValue:true,expression:`(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})));
const pgs=[...document.querySelectorAll('.pg')];let css='';pgs.forEach((p,i)=>{const h=Math.ceil(p.getBoundingClientRect().height);p.style.page='p'+i;css+='@page p'+i+'{size:1400px '+h+'px;margin:0}';});document.getElementById('sizes').textContent=css;return pgs.length})()`});
console.log("pages", r.result.result.value);
const pdf=await send("Page.printToPDF",{printBackground:true,preferCSSPageSize:true});
writeFileSync(out,Buffer.from(pdf.result.data,"base64")); ws.close(); proc.kill(); console.log("saved",out);
