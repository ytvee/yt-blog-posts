#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  assertSlug,
  hashFile,
  parseArgs,
  parseArticleFrontmatter,
  projectRoot,
  readJson,
  readingTimeDetails,
} from "./lib/project.mjs";

const args = parseArgs();
const queueRoot = path.join(projectRoot, "publication", "queue");

function queueEntries() {
  if (!fs.existsSync(queueRoot)) return [];
  return fs
    .readdirSync(queueRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => ({ slug: entry.name, directory: path.join(queueRoot, entry.name) }));
}

function validateQueue(entry) {
  assertSlug(entry.slug, "Slug очереди");
  const manifestPath = path.join(entry.directory, "manifest.json");
  const articlePath = path.join(entry.directory, "article.md");
  if (!fs.existsSync(manifestPath) || !fs.existsSync(articlePath)) {
    throw new Error(`${entry.slug}: очередь неполная`);
  }
  const manifest = readJson(manifestPath);
  if (manifest.schemaVersion !== 1) throw new Error(`${entry.slug}: неизвестная schemaVersion`);
  if (
    manifest.target?.repository !== "ytvee/yt-blog-posts" ||
    manifest.target?.branch !== "main" ||
    manifest.target?.path !== `content/${entry.slug}.md`
  ) {
    throw new Error(`${entry.slug}: недопустимая цель`);
  }
  if (manifest.articleSha256 !== hashFile(articlePath)) {
    throw new Error(`${entry.slug}: SHA статьи не совпадает с manifest`);
  }
  if (manifest.approval?.approvedBy !== "user" || !manifest.approval?.approvedAt) {
    throw new Error(`${entry.slug}: нет явного апрува`);
  }
  if (
    manifest.media?.status !== "ready" ||
    manifest.learning?.status !== "ready"
  ) {
    throw new Error(`${entry.slug}: не пройдены обязательные шлюзы`);
  }
  const article = fs.readFileSync(articlePath, "utf8");
  const parsed = parseArticleFrontmatter(article, entry.slug);
  if (parsed.values.get("published") !== "false") {
    throw new Error(`${entry.slug}: published должен быть false`);
  }
  if (/^#\s+/m.test(parsed.body)) throw new Error(`${entry.slug}: в теле запрещён H1`);
  if (!/<!--\s*IMAGE_SLOT\b/.test(parsed.body)) {
    throw new Error(`${entry.slug}: нет IMAGE_SLOT`);
  }
  const readingTime = readingTimeDetails(article).minutes;
  if (Number(parsed.values.get("readingTime")) !== readingTime) {
    throw new Error(`${entry.slug}: readingTime должен быть ${readingTime}`);
  }
  return { manifest, articlePath };
}

try {
  const entries = queueEntries();
  if (entries.length === 0) throw new Error("Очередь пуста");
  const targetDirectory = args["target-dir"]
    ? path.resolve(projectRoot, String(args["target-dir"]))
    : null;
  if (args.sync && !targetDirectory) {
    throw new Error("Для --sync нужен --target-dir");
  }

  for (const entry of entries) {
    const { manifest, articlePath } = validateQueue(entry);
    if (!args.sync) continue;
    const targetPath = path.resolve(targetDirectory, manifest.target.path);
    const targetContentRoot = path.resolve(targetDirectory, "content");
    if (!targetPath.startsWith(`${targetContentRoot}${path.sep}`)) {
      throw new Error(`${entry.slug}: целевой путь вышел за content/`);
    }
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    if (fs.existsSync(targetPath)) {
      if (hashFile(targetPath) !== hashFile(articlePath)) {
        throw new Error(`${entry.slug}: целевой файл существует с другим содержимым`);
      }
      console.log(`${entry.slug}: целевой файл уже совпадает`);
    } else {
      fs.copyFileSync(articlePath, targetPath);
      console.log(`${entry.slug}: подготовлен ${manifest.target.path}`);
    }
  }
  console.log(`Проверено очередей: ${entries.length}`);
} catch (error) {
  console.error(`Публикация остановлена: ${error.message}`);
  process.exit(1);
}
