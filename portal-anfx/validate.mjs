import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const sandbox = {window:{}};
vm.runInNewContext(await readFile(path.join(root,'dist/lessons.js'),'utf8'), sandbox);
const lessons = sandbox.window.ANFX_LESSONS;
const ids = new Set();
for (const lesson of lessons) {
  if (ids.has(lesson.id) || !/^[a-z0-9-]+$/.test(lesson.id)) throw new Error(`ID inválido: ${lesson.id}`);
  ids.add(lesson.id);
  for (const field of ['title','heading','intro','body','group','category']) if (!lesson[field]) throw new Error(`Campo ausente: ${lesson.id}.${field}`);
  if (!['lesson','guide','planned'].includes(lesson.kind)) throw new Error(`Status inválido: ${lesson.id}`);
  if (lesson.quiz && !(lesson.quiz.correct >= 0 && lesson.quiz.correct < lesson.quiz.options.length)) throw new Error(`Quiz inválido: ${lesson.id}`);
  for (const [, relative] of lesson.files || []) await access(path.join(root,'../aula_guiada_mcroservicos_net_ia',relative));
}
for (const lesson of lessons) for (const match of lesson.body.matchAll(/href="#([a-z0-9-]+)"/g)) if (!ids.has(match[1])) throw new Error(`Link inválido: ${match[1]}`);
console.log(`${lessons.length} páginas validadas; IDs, conteúdo, quizzes, links internos e referências de código conferidos.`);
