// Captures prototype screens at 3x through Chrome's DevTools protocol.
import { spawn } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const [, , base, outDir, ...pairs] = process.argv; // pairs: name=path
const chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const profile = mkdtempSync(join(tmpdir(), "cap-"));
const proc = spawn(chrome, ["--headless=new", "--remote-debugging-port=9333", `--user-data-dir=${profile}`, "--hide-scrollbars", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 50; i++) { try { targets = await (await fetch("http://127.0.0.1:9333/json")).json(); break; } catch { await sleep(200); } }
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener("open", r));
let id = 0; const waiting = new Map();
ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && waiting.has(m.id)) { waiting.get(m.id)(m); waiting.delete(m.id); } });
const send = (method, params = {}) => new Promise((r) => { const n = ++id; waiting.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const evaluate = async (expr) => (await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send("Page.enable"); await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 425, height: 884, deviceScaleFactor: 3, mobile: false });
await send("Page.navigate", { url: base + "/" });
await sleep(1500);
await evaluate(`localStorage.setItem("exechq.color","on"); true`);
// CAPTURE_STORAGE: a JSON object of extra localStorage keys, e.g. a dock state ({"exechq.loop": "..."}).
const extra = JSON.parse(process.env.CAPTURE_STORAGE || "{}");
for (const [k, v] of Object.entries(extra)) await evaluate(`localStorage.setItem(${JSON.stringify(k)}, ${JSON.stringify(v)}); true`);
for (const pair of pairs) {
  const cut = pair.indexOf("="); const name = pair.slice(0, cut); const path = pair.slice(cut + 1);
  await send("Page.navigate", { url: base + path });
  for (let i = 0; i < 120; i++) { if (await evaluate(`!!document.querySelector(".prototype--frame") && document.fonts.status === "loaded"`)) break; await sleep(250); }
  await sleep(1200);
  console.log("ready:", await evaluate(`document.querySelector(".prototype")?.className`));
  const h = await evaluate(`document.documentElement.scrollHeight`);
  await send("Emulation.setDeviceMetricsOverride", { width: 425, height: h, deviceScaleFactor: 3, mobile: false });
  await sleep(800);
  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(join(outDir, name + ".png"), Buffer.from(shot.result.data, "base64"));
  await send("Emulation.setDeviceMetricsOverride", { width: 425, height: 884, deviceScaleFactor: 3, mobile: false });
  console.log(name, h);
}
ws.close(); proc.kill();
