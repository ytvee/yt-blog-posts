#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  hashFile,
  parseArgs,
  projectRoot,
  readJson,
} from "./lib/project.mjs";

const args = parseArgs();
const targetCommit = String(args["target-commit"] ?? "").trim();
const targetDirectory = args["target-dir"]
  ? path.resolve(projectRoot, String(args["target-dir"]))
  : null;
if (!/^[0-9a-f]{40}$/i.test(targetCommit) || !targetDirectory) {
  console.error("Нужны --target-commit с полным SHA и --target-dir с checkout назначения");
  process.exit(2);
}

const queueRoot = path.join(projectRoot, "publication", "queue");
const ledgerPath = path.join(projectRoot, "memory", "article-ledger.md");

function safeRemovalTarget(target, parent) {
  const resolvedTarget = path.resolve(target);
  const resolvedParent = path.resolve(parent);
  if (!resolvedTarget.startsWith(`${resolvedParent}${path.sep}`) || resolvedTarget === resolvedParent) {
    throw new Error(`Небезопасная цель удаления: ${resolvedTarget}`);
  }
  return resolvedTarget;
}

try {
  const gitResult = spawnSync("git", ["-C", targetDirectory, "rev-parse", "HEAD"], {
    encoding: "utf8",
  });
  if (gitResult.status !== 0 || gitResult.stdout.trim() !== targetCommit) {
    throw new Error("Target commit не совпадает с HEAD checkout назначения");
  }
  const entries = fs
    .readdirSync(queueRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory());
  if (entries.length === 0) throw new Error("Очередь пуста");
  let ledger = fs.readFileSync(ledgerPath, "utf8");
  const deliveries = [];

  for (const entry of entries) {
    const queueDir = path.join(queueRoot, entry.name);
    const manifest = readJson(path.join(queueDir, "manifest.json"));
    const queueArticle = path.join(queueDir, "article.md");
    if (manifest.articleSha256 !== hashFile(queueArticle)) {
      throw new Error(`${entry.name}: SHA очереди изменился`);
    }
    const targetArticle = path.resolve(targetDirectory, manifest.target.path);
    const targetContentRoot = path.resolve(targetDirectory, "content");
    if (
      !targetArticle.startsWith(`${targetContentRoot}${path.sep}`) ||
      !fs.existsSync(targetArticle) ||
      hashFile(targetArticle) !== manifest.articleSha256
    ) {
      throw new Error(`${entry.name}: целевой файл не подтверждён в target checkout`);
    }
    const workDir = path.resolve(projectRoot, manifest.source.workPath);
    safeRemovalTarget(workDir, path.join(projectRoot, "work", "articles"));
    safeRemovalTarget(queueDir, queueRoot);
    deliveries.push({ queueDir, workDir });

    const marker = `<!-- delivery:${entry.name}:${manifest.articleSha256} -->`;
    if (!ledger.includes(marker)) {
      ledger += `

### Доставка: ${entry.name}

${marker}

- Статус: доставлена как черновик
- SHA статьи: \`${manifest.articleSha256}\`
- Target commit: \`${targetCommit}\`
- Репозиторий: \`https://github.com/ytvee/yt-blog-posts/blob/${targetCommit}/${manifest.target.path}\`
- Сайт после публикации: \`${manifest.target.siteUrl}\`
`;
    }
  }

  if (!args["dry-run"]) {
    fs.writeFileSync(ledgerPath, `${ledger.trimEnd()}\n`, "utf8");
    for (const { workDir, queueDir } of deliveries) {
      if (fs.existsSync(workDir)) fs.rmSync(workDir, { recursive: true });
      fs.rmSync(queueDir, { recursive: true });
    }
  }
  console.log(
    args["dry-run"]
      ? `Dry-run: можно завершить доставок: ${entries.length}`
      : `Доставка завершена, рабочие каталоги удалены: ${entries.length}`,
  );
} catch (error) {
  console.error(`Очистка остановлена: ${error.message}`);
  process.exit(1);
}
