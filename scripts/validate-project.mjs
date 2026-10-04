#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  sha256,
  parseArticleFrontmatter,
  readJson,
  readingTimeDetails,
} from "./lib/project.mjs";

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const errors = [];
let checks = 0;

function check(condition, message) {
  checks += 1;
  if (!condition) errors.push(message);
}

function existsFile(relativePath) {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function skillFrontmatter(source, label) {
  const match = source.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) throw new Error(`${label}: нет YAML-фронтматтера`);
  const name = match[1].match(/^name:\s*(?:"([^"]+)"|([^\r\n]+))$/m);
  const descriptionLine = match[1].match(/^description:\s*(.*)$/m);
  if (!name) throw new Error(`${label}: нет name`);
  if (!descriptionLine) throw new Error(`${label}: нет description`);
  let description = descriptionLine[1].trim();
  if (!description || [">", "|", ">-", "|-"].includes(description)) {
    const lines = match[1].split(/\r?\n/);
    const index = lines.findIndex((line) => line.startsWith("description:"));
    const folded = [];
    for (let lineIndex = index + 1; lineIndex < lines.length; lineIndex += 1) {
      if (!/^\s+/.test(lines[lineIndex])) break;
      folded.push(lines[lineIndex].trim());
    }
    description = folded.join(" ");
  }
  description = description.replace(/^"(.*)"$/, "$1");
  return {
    name: (name[1] ?? name[2]).trim(),
    description: description.trim(),
  };
}

function parseQuoted(value, field, label) {
  try {
    const parsed = JSON.parse(value);
    if (typeof parsed !== "string") throw new Error();
    return parsed;
  } catch {
    throw new Error(`${label}: поле ${field} должно быть строкой в двойных кавычках`);
  }
}

function articleIssues(text, label, allowTemplate = false) {
  const issues = [];
  let parsed;
  try {
    parsed = parseArticleFrontmatter(text, label);
  } catch (error) {
    return [error.message];
  }
  const expected = [
    "title",
    "date",
    "description",
    "tags",
    "readingTime",
    "ogImage",
    "published",
  ];
  for (const field of expected) {
    if (!parsed.values.has(field)) issues.push(`${label}: отсутствует поле ${field}`);
  }
  for (const field of parsed.values.keys()) {
    if (!expected.includes(field)) issues.push(`${label}: лишнее поле ${field}`);
  }
  if (issues.length) return issues;

  try {
    const title = parseQuoted(parsed.values.get("title"), "title", label);
    if (!title.trim()) issues.push(`${label}: title не может быть пустым`);
    if (!allowTemplate && title.trim().endsWith(".")) {
      issues.push(`${label}: title не должен заканчиваться точкой`);
    }
    const description = parseQuoted(parsed.values.get("description"), "description", label);
    if (!description.trim()) issues.push(`${label}: description не может быть пустым`);
    parseQuoted(parsed.values.get("ogImage"), "ogImage", label);
  } catch (error) {
    issues.push(error.message);
  }

  try {
    const tags = JSON.parse(parsed.values.get("tags"));
    if (
      !Array.isArray(tags) ||
      tags.length === 0 ||
      tags.some((tag) => typeof tag !== "string" || !tag.trim())
    ) {
      issues.push(`${label}: tags должен быть непустым массивом строк`);
    }
  } catch {
    issues.push(`${label}: tags должен быть JSON-совместимым массивом строк`);
  }

  let date = "";
  try {
    date = parseQuoted(parsed.values.get("date"), "date", label);
  } catch (error) {
    issues.push(error.message);
  }
  if (!(allowTemplate && date === "{{DATE}}")) {
    const parsedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00Z`)
      : null;
    if (
      !parsedDate ||
      Number.isNaN(parsedDate.valueOf()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      issues.push(`${label}: date должна быть реальной датой YYYY-MM-DD`);
    }
  }

  const readingTime = Number(parsed.values.get("readingTime"));
  if (!Number.isInteger(readingTime) || readingTime < 1) {
    issues.push(`${label}: readingTime должен быть положительным целым числом`);
  }
  if (parsed.values.get("published") !== "false") {
    issues.push(`${label}: рабочий черновик должен иметь published: false`);
  }
  if (/^#\s+/m.test(parsed.body)) issues.push(`${label}: H1 в теле статьи запрещён`);

  const slotIds = new Set();
  for (const match of parsed.body.matchAll(/<!--\s*IMAGE_SLOT\b([^>]*)-->/g)) {
    const attrs = Object.fromEntries(
      [...match[1].matchAll(/([a-zA-Z][a-zA-Z0-9-]*)="([^"]*)"/g)].map((item) => [
        item[1],
        item[2],
      ]),
    );
    if (!/^img-\d{2}$/.test(attrs.id ?? "")) issues.push(`${label}: неверный IMAGE_SLOT id`);
    if (slotIds.has(attrs.id)) issues.push(`${label}: повтор IMAGE_SLOT id ${attrs.id}`);
    slotIds.add(attrs.id);
    if (!attrs.role || !attrs.alt || !attrs.association) {
      issues.push(`${label}: IMAGE_SLOT ${attrs.id ?? ""} заполнен не полностью`);
    }
    if (attrs.role !== "video" && attrs.ratio !== "16:9") {
      issues.push(`${label}: IMAGE_SLOT ${attrs.id ?? ""} должен иметь ratio="16:9"`);
    }
  }
  return issues;
}

function validateStructure() {
  const directories = [
    ".agents/skills",
    "knowledge",
    "memory",
    "examples/articles",
    "examples/telegram",
    "templates",
    "work/articles",
    "scripts/lib",
    "content",
    ".github/workflows",
  ];
  const files = [
    "AGENTS.md",
    ".gitignore",
    "knowledge/author-style.md",
    "knowledge/headline-policy.md",
    "knowledge/editorial-policy.md",
    "knowledge/blog-format.md",
    "knowledge/source-policy.md",
    "knowledge/trend-policy.md",
    "knowledge/content-publication-contract.md",
    "memory/corrections-log.md",
    "memory/article-ledger.md",
    "memory/diversity-profile.md",
    "templates/article-brief.md",
    "templates/blog-post.md",
    "templates/media-plan.md",
    ".agents/skills/plan-article-images/references/editorial-ink-prompts.md",
    "third-party-skills.lock.json",
    "scripts/reading-time.mjs",
    "scripts/publication-gate.mjs",
    "scripts/prepare-publication.mjs",
    ".github/workflows/redeploy-blog.yml",
  ];
  for (const relativePath of directories) {
    const target = path.join(projectRoot, relativePath);
    check(fs.existsSync(target) && fs.statSync(target).isDirectory(), `Нет каталога: ${relativePath}`);
  }
  for (const relativePath of files) {
    check(existsFile(relativePath), `Нет файла: ${relativePath}`);
  }
  for (const obsoletePath of [
    "publication",
    "scripts/publish-queue.mjs",
    "scripts/complete-publication.mjs",
    ".github/workflows/publish-approved-articles.yml",
  ]) {
    check(!fs.existsSync(path.join(projectRoot, obsoletePath)), `Остался устаревший путь: ${obsoletePath}`);
  }
}

function validateSkills() {
  const localSkills = [
    "write-post",
    "revise-post",
    "learn-from-edits",
    "trend-research",
    "plan-article-images",
    "learn-from-article",
    "prepare-publication",
  ];
  const vendorSkills = ["ru-text", "humanizer-ru"];
  for (const skillName of [...localSkills, ...vendorSkills]) {
    const skillPath = `.agents/skills/${skillName}/SKILL.md`;
    const metadataPath = `.agents/skills/${skillName}/agents/openai.yaml`;
    check(existsFile(skillPath), `Нет файла: ${skillPath}`);
    check(existsFile(metadataPath), `Нет файла: ${metadataPath}`);
    if (!existsFile(skillPath)) continue;
    try {
      const metadata = skillFrontmatter(read(skillPath), skillPath);
      check(metadata.name === skillName, `${skillPath}: name не совпадает с каталогом`);
      check(/^[a-z0-9-]{1,64}$/.test(metadata.name), `${skillPath}: недопустимое имя`);
      check(metadata.description.length >= 40, `${skillPath}: description слишком короткий`);
    } catch (error) {
      errors.push(error.message);
    }
    if (!localSkills.includes(skillName) || !existsFile(metadataPath)) continue;
    const yaml = read(metadataPath);
    const display = yaml.match(/^\s{2}display_name:\s*"([^"]+)"\s*$/m);
    const short = yaml.match(/^\s{2}short_description:\s*"([^"]+)"\s*$/m);
    const prompt = yaml.match(/^\s{2}default_prompt:\s*"([^"]+)"\s*$/m);
    check(Boolean(display), `${metadataPath}: нет display_name`);
    check(Boolean(short), `${metadataPath}: нет short_description`);
    check(Boolean(prompt), `${metadataPath}: нет default_prompt`);
    if (short) {
      check(
        [...short[1]].length >= 25 && [...short[1]].length <= 64,
        `${metadataPath}: short_description должен содержать 25–64 символа`,
      );
    }
    if (prompt) check(prompt[1].includes(`$${skillName}`), `${metadataPath}: нет $${skillName}`);
    check(
      /policy:\s*\r?\n\s{2}allow_implicit_invocation:\s*true/.test(yaml),
      `${metadataPath}: не включён allow_implicit_invocation`,
    );
  }
}

function validateVendorLock() {
  try {
    const lock = readJson(path.join(projectRoot, "third-party-skills.lock.json"));
    const expected = new Map([
      ["ru-text", "9d7123183e91b94c762b7e3aa31ba1b981fb2b42"],
      ["humanizer-ru", "9a941722fcc44c446732cd77dfce31ffd3446040"],
    ]);
    for (const item of lock.skills ?? []) {
      if (!expected.has(item.name)) continue;
      check(item.commit === expected.get(item.name), `${item.name}: commit не закреплён`);
      check(item.license === "MIT", `${item.name}: лицензия не зафиксирована`);
      check(existsFile(`.agents/skills/${item.name}/LICENSE`), `${item.name}: нет LICENSE`);
      expected.delete(item.name);
    }
    check(expected.size === 0, "В lock-файле отсутствует внешний навык");
  } catch (error) {
    errors.push(`Lock-файл: ${error.message}`);
  }
}

function validateExamples() {
  const articles = fs.readdirSync(path.join(projectRoot, "examples", "articles")).filter((x) => x.endsWith(".md"));
  const telegram = fs.readdirSync(path.join(projectRoot, "examples", "telegram")).filter((x) => x.endsWith(".txt"));
  check(articles.length === 2, `Ожидалось 2 статьи, найдено: ${articles.length}`);
  check(telegram.length === 10, `Ожидалось 10 Telegram-примеров, найдено: ${telegram.length}`);
}

function validateContracts() {
  const agents = read("AGENTS.md");
  const write = read(".agents/skills/write-post/SKILL.md");
  const revise = read(".agents/skills/revise-post/SKILL.md");
  const learn = read(".agents/skills/learn-from-edits/SKILL.md");
  const trends = read(".agents/skills/trend-research/SKILL.md");
  const headlines = read("knowledge/headline-policy.md");
  const imagePlan = read(".agents/skills/plan-article-images/SKILL.md");
  const imagePrompts = read(".agents/skills/plan-article-images/references/editorial-ink-prompts.md");
  const blogFormat = read("knowledge/blog-format.md");
  const mediaTemplate = read("templates/media-plan.md");
  const prepare = read(".agents/skills/prepare-publication/SKILL.md");
  const workflow = read(".github/workflows/redeploy-blog.yml");
  const contentContract = read("knowledge/content-publication-contract.md");
  check(
    agents.includes("trend-research") &&
      agents.includes("knowledge/trend-policy.md") &&
      agents.includes("humanizer-ru"),
    "AGENTS.md: неполная маршрутизация",
  );
  check(
    trends.includes("Hacker News") &&
      trends.includes("баллы") &&
      trends.includes("комментариев") &&
      trends.includes("headline-policy.md") &&
      trends.includes("Не подменять"),
    "trend-research: неполный контракт источников и метрик",
  );
  check(
    write.includes("source-policy.md") &&
      write.includes("headline-policy.md") &&
      write.includes("7–10 вариантов") &&
      write.includes("brief.md"),
    "write-post: нет проверки источников, заголовка и брифа",
  );
  const normalizedHeadlines = headlines.toLocaleLowerCase("ru-RU");
  check(
    normalizedHeadlines.includes("один заголовок — одна основная задача") &&
      normalizedHeadlines.includes("не копировать чужие заголовки"),
    "headline-policy: нет правил точности и самостоятельности",
  );
  check(
    revise.includes("<NNN>-before.md") &&
      revise.includes("<NNN>-after.md") &&
      revise.includes("<NNN>-feedback.md"),
    "revise-post: нет контракта версий",
  );
  check(
    learn.includes("статусом `candidate`") && learn.includes("статус на `promoted`"),
    "learn-from-edits: нет повышения правила",
  );
  check(
    imagePlan.includes("references/editorial-ink-prompts.md") &&
      imagePlan.includes('ratio="16:9"') &&
      imagePlan.includes('ratio: "1:1"') &&
      imagePlan.includes("Не ждать отдельного запроса пользователя"),
    "plan-article-images: неполный контракт форматов и промптов",
  );
  check(
    imagePrompts.includes("чёрной гелевой ручкой") &&
      imagePrompts.includes("10–12%") &&
      imagePrompts.includes("Квадратная OG-картинка") &&
      imagePrompts.includes("Доказательные материалы"),
    "plan-article-images: неполный справочник визуального стиля",
  );
  check(
    blogFormat.includes('ratio="16:9"') &&
      mediaTemplate.includes('"schemaVersion": 2') &&
      mediaTemplate.includes('"ratio": "1:1"'),
    "Медиаформат: не закреплены IMAGE_SLOT 16:9 и OG 1:1",
  );
  check(
    prepare.includes("--approved-by user") &&
      prepare.includes("content/<slug>.md") &&
      !prepare.includes("--english-slug"),
    "prepare-publication: неверный локальный контракт",
  );
  check(
    workflow.includes("posts_updated") && workflow.includes("BLOG_REPO_DISPATCH_TOKEN"),
    "Workflow: нет уведомления сайта об изменении постов",
  );
  check(
    agents.includes("Не читать лежащие там посты") &&
      write.includes("Никогда не читать файлы") &&
      trends.includes("Не читать `../../../content/`") &&
      contentContract.includes("только выходом публикационного процесса"),
    "content/: не зафиксирован запрет на использование постов как референсов",
  );
}

function validateConfiguration() {
  check(
    sha256(read(".vscode/settings.json").replace(/\r\n/g, "\n")) ===
      "d2afc90b8ca7d0458f9542f77ef6080e7bfcd2b2906a7b75fc62ccea8c0b0d78",
    ".vscode/settings.json был изменён",
  );
}

function validateArticleFile(input) {
  const absolutePath = path.isAbsolute(input) ? path.resolve(input) : path.resolve(projectRoot, input);
  const relative = path.relative(projectRoot, absolutePath);
  check(!relative.startsWith("..") && !path.isAbsolute(relative), `Статья вне проекта: ${input}`);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return;
  check(fs.existsSync(absolutePath), `Статья не найдена: ${input}`);
  if (!fs.existsSync(absolutePath)) return;
  const source = fs.readFileSync(absolutePath, "utf8");
  errors.push(...articleIssues(source, input));
  if (articleIssues(source, input).length === 0) {
    const parsed = parseArticleFrontmatter(source, input);
    const expected = readingTimeDetails(source).minutes;
    check(Number(parsed.values.get("readingTime")) === expected, `${input}: readingTime должен быть ${expected}`);
  }
}

function selfTests() {
  const valid = `---
title: "Проверочная статья"
date: "2026-07-25"
description: "Описание проверочного материала."
tags: ["тест"]
readingTime: 1
ogImage: ""
published: false
---

## Раздел

Короткий текст.
`;
  check(articleIssues(valid, "self-test").length === 0, "Self-test: валидная статья отклонена");
  check(
    articleIssues(valid.replace("published: false", "published: true"), "self-test").length > 0,
    "Self-test: published:true принят",
  );
  check(
    articleIssues(valid.replace('date: "2026-07-25"', 'date: "2026-02-31"'), "self-test").length > 0,
    "Self-test: повреждённая дата принята",
  );
  check(
    articleIssues(valid.replace("## Раздел", "# H1"), "self-test").length > 0,
    "Self-test: H1 в теле принят",
  );
  const validWithImage = valid.replace(
    "## Раздел",
    '<!-- IMAGE_SLOT id="img-01" role="hero" ratio="16:9" alt="Схема" association="Конвейер" -->\n\n## Раздел',
  );
  check(
    articleIssues(validWithImage, "self-test").length === 0,
    "Self-test: валидный IMAGE_SLOT 16:9 отклонён",
  );
  check(
    articleIssues(validWithImage.replace(' ratio="16:9"', ""), "self-test").length > 0,
    "Self-test: IMAGE_SLOT без ratio принят",
  );
  check(
    articleIssues(validWithImage.replace('ratio="16:9"', 'ratio="1:1"'), "self-test").length > 0,
    "Self-test: квадратный IMAGE_SLOT внутри статьи принят",
  );
  check(readingTimeDetails(valid).minutes === 1, "Self-test: ошибка readingTime");
}

validateStructure();
validateSkills();
validateVendorLock();
validateExamples();
validateContracts();
validateConfiguration();

try {
  errors.push(...articleIssues(read("templates/blog-post.md"), "templates/blog-post.md", true));
} catch (error) {
  errors.push(error.message);
}

for (const argument of process.argv.slice(2).filter((item) => !item.startsWith("--"))) {
  validateArticleFile(argument);
}
if (process.argv.includes("--self-test")) selfTests();

if (errors.length) {
  console.error(`Проверка не пройдена. Ошибок: ${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Проверка пройдена: ${checks} проверок, ошибок нет.`);
