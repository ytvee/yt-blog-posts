#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { extractContract, hashFile, projectRoot } from "./lib/project.mjs";

const sourceSlug = "test-publication-flow";
const englishSlug = "test-publication-article";
const workRoot = path.join(projectRoot, "work", "articles");
const sourceDir = path.join(workRoot, sourceSlug);
const queueDir = path.join(projectRoot, "publication", "queue", englishSlug);
const targetDir = path.join(projectRoot, ".test-target");
const invalidFile = path.join(projectRoot, "work", "test-invalid-frontmatter.md");
const ledgerPath = path.join(projectRoot, "memory", "article-ledger.md");
const ledgerOriginal = fs.readFileSync(ledgerPath, "utf8");
let assertions = 0;

function assert(condition, message) {
  assertions += 1;
  if (!condition) throw new Error(message);
}

function run(script, argumentsList, options = {}) {
  const result = spawnSync(process.execPath, [path.join(projectRoot, "scripts", script), ...argumentsList], {
    cwd: projectRoot,
    encoding: "utf8",
  });
  if (options.expectFailure) {
    assert(result.status !== 0, `${script} должен был завершиться ошибкой`);
  } else if (result.status !== 0) {
    throw new Error(`${script} завершился ошибкой:\n${result.stdout ?? ""}\n${result.stderr ?? ""}`);
  }
  return result;
}

function safeRemove(target, parent = projectRoot) {
  const resolved = path.resolve(target);
  const resolvedParent = path.resolve(parent);
  if (!resolved.startsWith(`${resolvedParent}${path.sep}`) || resolved === resolvedParent) {
    throw new Error(`Небезопасная очистка теста: ${resolved}`);
  }
  if (fs.existsSync(resolved)) fs.rmSync(resolved, { recursive: true });
}

function git(argumentsList) {
  const result = spawnSync("git", argumentsList, { cwd: targetDir, encoding: "utf8" });
  if (result.status !== 0) throw new Error(`git ${argumentsList.join(" ")}:\n${result.stderr}`);
  return result.stdout.trim();
}

try {
  for (const target of [sourceDir, queueDir, targetDir]) {
    assert(!fs.existsSync(target), `Тестовая цель уже существует: ${target}`);
  }

  fs.mkdirSync(path.join(sourceDir, "revisions"), { recursive: true });
  const articlePath = path.join(sourceDir, "current.md");
  fs.writeFileSync(
    articlePath,
    `---
title: "Как устроен редакторский конвейер"
date: "2026-07-26"
description: "Проверка подготовки и доставки утверждённой статьи."
tags: ["редактура", "блог"]
readingTime: 1
ogImage: ""
published: false
---

<!-- IMAGE_SLOT id="img-01" role="hero" alt="Схема редакторского конвейера" association="Последовательная сборка материала из проверенных частей" -->

Короткое авторское вступление.

<a id="workflow"></a>

## От черновика до публикации

Материал проходит редактуру, медиаплан и явное утверждение пользователя.
`,
    "utf8",
  );
  run("reading-time.mjs", [`work/articles/${sourceSlug}/current.md`, "--write"]);

  const articleHash = hashFile(articlePath);
  fs.writeFileSync(
    path.join(sourceDir, "media-plan.md"),
    `# Медиаплан

<!-- MEDIA_CONTRACT
${JSON.stringify(
  {
    schemaVersion: 1,
    status: "ready",
    articleSha256: articleHash,
    slots: [
      {
        id: "img-01",
        role: "hero",
        alt: "Схема редакторского конвейера",
        association: "Последовательная сборка материала из проверенных частей",
      },
    ],
  },
  null,
  2,
)}
-->
`,
    "utf8",
  );
  fs.writeFileSync(
    path.join(sourceDir, "learning-report.md"),
    `# Выводы

<!-- LEARNING_CONTRACT
${JSON.stringify(
  {
    schemaVersion: 1,
    status: "ready",
    articleSha256: articleHash,
    ledgerSlug: englishSlug,
  },
  null,
  2,
)}
-->
`,
    "utf8",
  );
  fs.writeFileSync(ledgerPath, `${ledgerOriginal.trimEnd()}\n\n<!-- article:${englishSlug}:${articleHash} -->\n`, "utf8");

  run("publication-gate.mjs", ["check", "--slug", sourceSlug]);
  run("prepare-publication.mjs", [
    "--slug",
    sourceSlug,
    "--english-slug",
    englishSlug,
    "--approved-by",
    "user",
  ]);
  run("publish-queue.mjs", []);

  const manifest = JSON.parse(fs.readFileSync(path.join(queueDir, "manifest.json"), "utf8"));
  assert(manifest.media.status === "ready", "Медиаплан не зафиксирован");
  assert(extractContract(fs.readFileSync(path.join(sourceDir, "media-plan.md"), "utf8"), "MEDIA_CONTRACT").status === "ready", "Медиаплан не готов");

  fs.mkdirSync(targetDir, { recursive: true });
  git(["init", "-b", "main"]);
  git(["config", "user.name", "YT Writer Test"]);
  git(["config", "user.email", "test@example.invalid"]);
  run("publish-queue.mjs", ["--sync", "--target-dir", ".test-target"]);
  run("publish-queue.mjs", ["--sync", "--target-dir", ".test-target"]);
  const targetArticle = path.join(targetDir, "content", `${englishSlug}.md`);
  const targetOriginal = fs.readFileSync(targetArticle, "utf8");
  fs.writeFileSync(targetArticle, `${targetOriginal}\nконфликт\n`, "utf8");
  run("publish-queue.mjs", ["--sync", "--target-dir", ".test-target"], { expectFailure: true });
  fs.writeFileSync(targetArticle, targetOriginal, "utf8");
  git(["add", "content"]);
  git(["commit", "-m", "test target"]);
  const targetCommit = git(["rev-parse", "HEAD"]);
  assert(/^[0-9a-f]{40}$/.test(targetCommit), "Не получен SHA тестового target commit");

  run("complete-publication.mjs", ["--target-commit", targetCommit, "--target-dir", ".test-target", "--dry-run"]);
  assert(fs.existsSync(sourceDir) && fs.existsSync(queueDir), "Dry-run удалил файлы");
  run("complete-publication.mjs", ["--target-commit", targetCommit, "--target-dir", ".test-target"]);
  assert(!fs.existsSync(sourceDir) && !fs.existsSync(queueDir), "Доставка не очистила исходники");

  fs.writeFileSync(
    invalidFile,
    `---
title: "Сломано"
date: "2026-02-31"
description: "Тест"
tags: []
readingTime: 0
ogImage: ""
published: true
---

# H1
`,
    "utf8",
  );
  run("validate-project.mjs", ["work/test-invalid-frontmatter.md"], { expectFailure: true });

  console.log(`Интеграционные сценарии пройдены: ${assertions} проверок.`);
} finally {
  fs.writeFileSync(ledgerPath, ledgerOriginal, "utf8");
  safeRemove(sourceDir, workRoot);
  safeRemove(queueDir, path.join(projectRoot, "publication", "queue"));
  safeRemove(targetDir);
  if (fs.existsSync(invalidFile)) fs.rmSync(invalidFile);
}
