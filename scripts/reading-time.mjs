#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  parseArgs,
  projectRoot,
  readingTimeDetails,
  updateReadingTime,
} from "./lib/project.mjs";

const args = parseArgs();
const input = args._[0];
if (!input) {
  console.error("Использование: node scripts/reading-time.mjs <article.md> [--write] [--details]");
  process.exit(2);
}

const filePath = path.isAbsolute(input) ? input : path.resolve(projectRoot, input);
const relativePath = path.relative(projectRoot, filePath);
if (
  relativePath.startsWith("..") ||
  path.isAbsolute(relativePath) ||
  !fs.existsSync(filePath)
) {
  console.error(`Файл не найден внутри проекта: ${input}`);
  process.exit(1);
}

const source = fs.readFileSync(filePath, "utf8");
const details = readingTimeDetails(source);
if (args.write) {
  fs.writeFileSync(filePath, updateReadingTime(source, details.minutes), "utf8");
}

if (args.details) console.log(JSON.stringify(details, null, 2));
else console.log(details.minutes);
