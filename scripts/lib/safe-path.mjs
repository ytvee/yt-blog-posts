import fs from "node:fs";
import path from "node:path";

// Проверяем каждый компонент: realpath одного конечного файла не выявляет
// ссылку, которая ведёт обратно внутрь разрешённого каталога.
export function assertSafePath(root, target) {
  const base = path.resolve(root);
  const resolved = path.resolve(target);
  const relative = path.relative(base, resolved);
  if (relative === ".." || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Путь вне разрешённого каталога: ${target}`);
  }
  let current = path.parse(base).root;
  for (const part of resolved.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = fs.lstatSync(current, { throwIfNoEntry: false });
    if (stat?.isSymbolicLink()) throw new Error(`Символическая ссылка запрещена: ${current}`);
  }
  return resolved;
}

export function assertSafeTree(root, target) {
  const resolved = assertSafePath(root, target);
  if (fs.statSync(resolved).isDirectory()) {
    for (const entry of fs.readdirSync(resolved)) assertSafeTree(root, path.join(resolved, entry));
  }
  return resolved;
}
