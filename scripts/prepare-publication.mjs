#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { assertSlug, hashFile, parseArgs, projectRoot } from "./lib/project.mjs";
import { checkPublicationPrerequisites } from "./publication-gate.mjs";
import { cleanupPublishedArticle, publicationPaths, resumePublicationCleanup } from "./lib/publication-cleanup.mjs";
import { assertSafeTree } from "./lib/safe-path.mjs";
import { spawnSync } from "node:child_process";

const args = parseArgs();
if (!args.slug || args["approved-by"] !== "user") {
  console.error(
    "Использование: node scripts/prepare-publication.mjs --slug <slug> --approved-by user",
  );
  process.exit(2);
}

let copied = false;
try {
  const slug = assertSlug(String(args.slug), "Рабочий slug");
  const { workRoot, sourceDir, targetPath } = publicationPaths(slug);
  copied = fs.existsSync(path.join(projectRoot, "work", ".publication-cleanup", `${slug}.json`));
  const resumedHash = resumePublicationCleanup(slug);
  if (resumedHash) {
    console.log(`Завершена очистка work/articles/${slug}/ после прежней публикации. SHA-256: ${resumedHash}`);
    process.exit(0);
  }
  if (!fs.existsSync(sourceDir)) {
    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
      throw new Error("Нет ни рабочей папки, ни опубликованного файла");
    }
    console.log(`Рабочая папка уже отсутствует; content/${slug}.md сохранён без изменений.`);
    process.exit(0);
  }
  assertSafeTree(workRoot, sourceDir);
  const validation = spawnSync(
    process.execPath,
    [path.join(projectRoot, "scripts", "validate-project.mjs"), `work/articles/${slug}/current.md`],
    { cwd: projectRoot, encoding: "utf8" },
  );
  if (validation.status !== 0) throw new Error(`Валидация не пройдена:\n${validation.stderr || validation.error || validation.stdout}`);
  const prerequisites = checkPublicationPrerequisites(slug);
  if (prerequisites.errors.length) {
    throw new Error(
      `Публикационный шлюз не пройден:\n${prerequisites.errors.map((item) => `- ${item}`).join("\n")}`,
    );
  }

  const contentRoot = path.join(projectRoot, "content");
  fs.mkdirSync(contentRoot, { recursive: true });

  if (fs.existsSync(targetPath) && hashFile(targetPath) === prerequisites.articleHash) {
    console.log(`Файл уже опубликован и совпадает: content/${slug}.md`);
  } else {
    fs.copyFileSync(prerequisites.articlePath, targetPath);
  }
  const targetHash = hashFile(targetPath);
  if (targetHash !== prerequisites.articleHash) {
    throw new Error("SHA-256 исходного и целевого файлов не совпадает после копирования");
  }
  copied = true;
  cleanupPublishedArticle(slug, targetHash);

  console.log(`Черновик скопирован: content/${slug}.md`);
  console.log(`SHA-256: ${targetHash}`);
  console.log(`Удалена только рабочая папка work/articles/${slug}/. Страница исчезнет после следующего деплоя Pages.`);
} catch (error) {
  console.error(`${copied ? "Файл уже скопирован; очистка не завершена" : "Публикация не завершена; рабочая папка сохранена"}: ${error.message}`);
  process.exit(1);
}
