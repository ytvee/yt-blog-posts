#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { hashFile, projectRoot } from "./lib/project.mjs";

const slug = "test-publication-flow";
const workRoot = path.join(projectRoot, "work", "articles");
const sourceDir = path.join(workRoot, slug);
const articlePath = path.join(sourceDir, "current.md");
const targetPath = path.join(projectRoot, "content", `${slug}.md`);
const invalidFile = path.join(projectRoot, "work", "test-invalid-frontmatter.md");
const ledgerPath = path.join(projectRoot, "memory", "article-ledger.md");
const ledgerOriginal = fs.readFileSync(ledgerPath, "utf8");
let assertions = 0;

function assert(condition, message) {
  assertions += 1;
  if (!condition) throw new Error(message);
}

function run(script, argumentsList, options = {}) {
  const result = spawnSync(
    process.execPath,
    [path.join(projectRoot, "scripts", script), ...argumentsList],
    { cwd: projectRoot, encoding: "utf8" },
  );
  if (options.expectFailure) {
    assert(result.status !== 0, `${script} должен был завершиться ошибкой`);
  } else if (result.status !== 0) {
    throw new Error(
      `${script} завершился ошибкой:\n${result.stdout ?? ""}\n${result.stderr ?? ""}`,
    );
  }
  return result;
}

function safeRemove(target, parent) {
  const resolved = path.resolve(target);
  const resolvedParent = path.resolve(parent);
  if (!resolved.startsWith(`${resolvedParent}${path.sep}`) || resolved === resolvedParent) {
    throw new Error(`Небезопасная очистка теста: ${resolved}`);
  }
  if (fs.existsSync(resolved)) fs.rmSync(resolved, { recursive: true });
}

function article(extra = "") {
  return `---
title: "Как устроен редакторский конвейер"
date: "2026-07-26"
description: "Проверка локальной публикации утверждённой статьи."
tags: ["редактура", "блог"]
readingTime: 1
ogImage: ""
published: false
---

<!-- IMAGE_SLOT id="img-01" role="hero" alt="Схема редакторского конвейера" association="Последовательная сборка материала" -->

Короткое авторское вступление.

## От черновика до публикации

Материал проходит редактуру, медиаплан и явное утверждение пользователя.${extra}
`;
}

function writeContracts(articleHash) {
  fs.writeFileSync(
    path.join(sourceDir, "media-plan.md"),
    `# Медиаплан

<!-- MEDIA_CONTRACT
${JSON.stringify(
  {
    schemaVersion: 1,
    status: "ready",
    articleSha256: articleHash,
    slots: [{
      id: "img-01",
      role: "hero",
      alt: "Схема редакторского конвейера",
      association: "Последовательная сборка материала",
    }],
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
    ledgerSlug: slug,
  },
  null,
  2,
)}
-->
`,
    "utf8",
  );
  fs.writeFileSync(
    ledgerPath,
    `${ledgerOriginal.trimEnd()}\n\n<!-- article:${slug}:${articleHash} -->\n`,
    "utf8",
  );
}

try {
  assert(!fs.existsSync(sourceDir), `Тестовый рабочий каталог уже существует: ${sourceDir}`);
  assert(!fs.existsSync(targetPath), `Тестовый целевой файл уже существует: ${targetPath}`);

  fs.mkdirSync(path.join(sourceDir, "revisions"), { recursive: true });
  fs.writeFileSync(articlePath, article(), "utf8");
  run("reading-time.mjs", [`work/articles/${slug}/current.md`, "--write"]);
  writeContracts(hashFile(articlePath));

  run("prepare-publication.mjs", ["--slug", slug], { expectFailure: true });
  assert(!fs.existsSync(targetPath), "Файл создан без явного апрува");

  run("publication-gate.mjs", ["check", "--slug", slug]);
  run("prepare-publication.mjs", ["--slug", slug, "--approved-by", "user"]);
  assert(fs.existsSync(targetPath), "Целевой файл не создан");
  assert(hashFile(targetPath) === hashFile(articlePath), "SHA-256 после копирования не совпадает");
  assert(
    fs.readFileSync(targetPath, "utf8").includes("published: false"),
    "При копировании изменён published",
  );
  assert(fs.existsSync(sourceDir), "Рабочий каталог удалён после публикации");

  const firstHash = hashFile(targetPath);
  run("prepare-publication.mjs", ["--slug", slug, "--approved-by", "user"]);
  assert(hashFile(targetPath) === firstHash, "Идемпотентный запуск изменил целевой файл");

  fs.writeFileSync(articlePath, article("\n\nДобавлена утверждённая версия."), "utf8");
  run("reading-time.mjs", [`work/articles/${slug}/current.md`, "--write"]);
  run("prepare-publication.mjs", ["--slug", slug, "--approved-by", "user"], {
    expectFailure: true,
  });
  assert(hashFile(targetPath) === firstHash, "Устаревшие контракты позволили перезапись");

  writeContracts(hashFile(articlePath));
  run("prepare-publication.mjs", ["--slug", slug, "--approved-by", "user"]);
  assert(hashFile(targetPath) === hashFile(articlePath), "Новая версия не скопирована");
  assert(hashFile(targetPath) !== firstHash, "Целевой файл не обновился");
  assert(fs.existsSync(sourceDir), "Рабочий каталог удалён после обновления");

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
  safeRemove(targetPath, path.join(projectRoot, "content"));
  if (fs.existsSync(invalidFile)) fs.rmSync(invalidFile);
}
