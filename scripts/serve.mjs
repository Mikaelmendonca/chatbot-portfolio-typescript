// Servidor estático mínimo para desenvolvimento local (sem dependências).
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public");
const port = Number(process.env.PORT ?? 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css" };

createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", "http://localhost");
  const rel = url.pathname === "/" ? "/index.html" : url.pathname;
  const file = path.join(root, path.normalize(rel));
  if (!file.startsWith(root)) return void res.writeHead(403).end();
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[path.extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404).end("Not found");
  }
}).listen(port, () => console.log(`Chatbot em http://localhost:${port}`));
