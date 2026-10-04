import fs from "node:fs";
import path from "node:path";
import { assertSlug, hashFile, projectRoot } from "./project.mjs";
import { assertSafePath, assertSafeTree } from "./safe-path.mjs";

export function publicationPaths(slug, root = projectRoot) {
  assertSlug(slug, "Рабочий slug");
  const workRoot = assertSafePath(root, path.join(root, "work", "articles"));
  const sourceDir = assertSafePath(workRoot, path.join(workRoot, slug));
  const targetPath = assertSafePath(root, path.join(root, "content", `${slug}.md`));
  return { workRoot, sourceDir, targetPath };
}

export function cleanupPublishedArticle(slug, expectedHash, root = projectRoot) {
  const { workRoot, sourceDir, targetPath } = publicationPaths(slug, root);
  assertSafeTree(workRoot, sourceDir);
  const articlePath = path.join(sourceDir, "current.md");
  if (hashFile(articlePath) !== expectedHash || hashFile(targetPath) !== expectedHash) {
    throw new Error("SHA-256 исходного и целевого файлов не совпадает; рабочая папка сохранена");
  }
  const receiptPath = cleanupReceipt(slug, root);
  fs.mkdirSync(path.dirname(receiptPath), { recursive: true });
  fs.writeFileSync(receiptPath, JSON.stringify({ schemaVersion: 1, articleHash: expectedHash, entries: snapshot(sourceDir) }), { flag: "wx" });
  fs.rmSync(sourceDir, { recursive: true });
  fs.unlinkSync(receiptPath);
}

function cleanupReceipt(slug, root) {
  assertSlug(slug);
  return assertSafePath(root, path.join(root, "work", ".publication-cleanup", `${slug}.json`));
}

function snapshot(directory, prefix = "") {
  const entries = {};
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${item.name}` : item.name;
    const absolute = path.join(directory, item.name);
    if (item.isDirectory()) {
      entries[relative] = "directory";
      Object.assign(entries, snapshot(absolute, relative));
    } else if (item.isFile()) entries[relative] = hashFile(absolute);
    else throw new Error(`Недопустимый тип файла: ${absolute}`);
  }
  return entries;
}

// rmSync может успеть удалить часть файлов перед ошибкой. Квитанция позволяет
// завершить именно эту очистку, не требуя уже удалённого медиаплана или current.md.
export function resumePublicationCleanup(slug, root = projectRoot) {
  const receiptPath = cleanupReceipt(slug, root);
  if (!fs.existsSync(receiptPath)) return null;
  const { workRoot, sourceDir, targetPath } = publicationPaths(slug, root);
  const receipt = JSON.parse(fs.readFileSync(receiptPath, "utf8"));
  if (receipt.schemaVersion !== 1 || !/^[a-f0-9]{64}$/.test(receipt.articleHash ?? "") || !receipt.entries || hashFile(targetPath) !== receipt.articleHash) {
    throw new Error("Квитанция очистки или опубликованный файл изменились; очистка остановлена");
  }
  if (fs.existsSync(sourceDir)) {
    assertSafeTree(workRoot, sourceDir);
    for (const [relative, hash] of Object.entries(snapshot(sourceDir))) {
      if (!Object.hasOwn(receipt.entries, relative) || receipt.entries[relative] !== hash) {
        throw new Error(`После публикации изменён рабочий файл ${relative}; очистка остановлена`);
      }
    }
    fs.rmSync(sourceDir, { recursive: true });
  }
  fs.unlinkSync(receiptPath);
  return receipt.articleHash;
}
