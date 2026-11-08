import http from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const staticRoot = await realpath(path.join(root, 'dist'));
const codeRoot = await realpath(path.join(root, '..', 'aula_guiada_mcroservicos_net_ia'));
const port = Number(process.env.PORT || 4173);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
const inside = (base, target) => {const relative = path.relative(base, target);return relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);};
const server = http.createServer(async (request, response) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Cache-Control', 'no-store');
  if (!['GET','HEAD'].includes(request.method)) {response.writeHead(405, {Allow:'GET, HEAD'});response.end();return;}
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) throw new Error('Invalid path');
    const isCode = pathname.startsWith('/codigo/');
    const base = isCode ? codeRoot : staticRoot;
    const relative = isCode ? pathname.slice('/codigo/'.length) : pathname === '/' ? 'index.html' : pathname.slice(1);
    // Expose only source and project declarations. Never serve settings, user files or build outputs.
    if (isCode && (!/^(src|tests)\/[\w./-]+\.(cs|csproj)$/.test(relative) || relative.split('/').some(part => ['..','obj','bin'].includes(part)))) throw new Error('Not allowed');
    const target = await realpath(path.resolve(base, relative));
    if (!inside(base,target)) throw new Error('Not allowed');
    const content = await readFile(target);
    response.writeHead(200, {'Content-Type':isCode ? 'text/plain; charset=utf-8' : types[path.extname(target)] || 'application/octet-stream'});
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {response.writeHead(404, {'Content-Type':'text/plain; charset=utf-8'});response.end('Arquivo não encontrado ou não disponível para consulta.');}
});
server.listen(port, '127.0.0.1', () => console.log(`ANFX Lab: http://127.0.0.1:${port}`));
