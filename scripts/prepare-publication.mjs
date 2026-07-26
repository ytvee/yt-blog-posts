#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { assertSlug, hashFile, parseArgs, projectRoot } from "./lib/project.mjs";
import { checkPublicationPrerequisites } from "./publication-gate.mjs";

const args = parseArgs();
if (!args.slug || args["approved-by"] !== "user") {
  console.error(
    "Использование: node scripts/prepare-publication.mjs --slug <slug> --approved-by user",
  );
  process.exit(2);
}

try {
  const slug = assertSlug(String(args.slug), "Рабочий slug");
  const prerequisites = checkPublicationPrerequisites(slug);
  if (prerequisites.errors.length) {
    throw new Error(
      `Публикационный шлюз не пройден:\n${prerequisites.errors.map((item) => `- ${item}`).join("\n")}`,
    );
  }

  const contentRoot = path.join(projectRoot, "content");
  const targetPath = path.join(contentRoot, `${slug}.md`);
  fs.mkdirSync(contentRoot, { recursive: true });

  if (fs.existsSync(targetPath) && hashFile(targetPath) === prerequisites.articleHash) {
    console.log(`Файл уже опубликован и совпадает: content/${slug}.md`);
    console.log(`SHA-256: ${prerequisites.articleHash}`);
    process.exit(0);
  }

  fs.copyFileSync(prerequisites.articlePath, targetPath);
  const targetHash = hashFile(targetPath);
  if (targetHash !== prerequisites.articleHash) {
    throw new Error("SHA-256 исходного и целевого файлов не совпадает после копирования");
  }

  console.log(`Черновик скопирован: content/${slug}.md`);
  console.log(`SHA-256: ${targetHash}`);
} catch (error) {
  console.error(`Черновик не скопирован: ${error.message}`);
  process.exit(1);
}
