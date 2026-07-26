#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  assertSlug,
  hashFile,
  parseArgs,
  projectRoot,
  writeJson,
} from "./lib/project.mjs";
import { checkPublicationPrerequisites } from "./publication-gate.mjs";

const args = parseArgs();
if (!args.slug || !args["english-slug"] || args["approved-by"] !== "user") {
  console.error(
    "Использование: node scripts/prepare-publication.mjs --slug <slug> --english-slug <slug> --approved-by user",
  );
  process.exit(2);
}

try {
  const sourceSlug = assertSlug(String(args.slug), "Рабочий slug");
  const englishSlug = assertSlug(String(args["english-slug"]), "Английский slug");
  const prerequisites = checkPublicationPrerequisites(sourceSlug);
  if (prerequisites.errors.length) {
    throw new Error(
      `Публикационный шлюз не пройден:\n${prerequisites.errors.map((item) => `- ${item}`).join("\n")}`,
    );
  }

  const queueDir = path.join(projectRoot, "publication", "queue", englishSlug);
  const queueArticle = path.join(queueDir, "article.md");
  const manifestPath = path.join(queueDir, "manifest.json");
  if (fs.existsSync(queueDir)) {
    if (!fs.existsSync(queueArticle) || hashFile(queueArticle) !== prerequisites.articleHash) {
      throw new Error(`Очередь ${englishSlug} уже существует с другим содержимым`);
    }
    console.log(`Очередь уже существует и совпадает: publication/queue/${englishSlug}`);
    process.exit(0);
  }

  fs.mkdirSync(queueDir, { recursive: true });
  fs.copyFileSync(prerequisites.articlePath, queueArticle);
  const manifest = {
    schemaVersion: 1,
    target: {
      repository: "ytvee/yt-blog-posts",
      branch: "main",
      path: `content/${englishSlug}.md`,
      siteUrl: `https://www.ytdev.me/blog/${englishSlug}`,
    },
    source: {
      slug: sourceSlug,
      workPath: `work/articles/${sourceSlug}`,
      articlePath: `work/articles/${sourceSlug}/current.md`,
    },
    articleSha256: prerequisites.articleHash,
    media: {
      planPath: `work/articles/${sourceSlug}/media-plan.md`,
      planSha256: hashFile(prerequisites.mediaPath),
      status: "ready",
    },
    learning: {
      reportPath: `work/articles/${sourceSlug}/learning-report.md`,
      reportSha256: hashFile(prerequisites.learningPath),
      status: "ready",
    },
    approval: {
      approvedBy: "user",
      approvedAt: new Date().toISOString(),
    },
  };
  writeJson(manifestPath, manifest);
  console.log(`Очередь создана: publication/queue/${englishSlug}`);
} catch (error) {
  console.error(`Очередь не создана: ${error.message}`);
  process.exit(1);
}
