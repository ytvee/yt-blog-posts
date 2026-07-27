#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  articleDirectory,
  extractContract,
  hashFile,
  parseArgs,
  parseArticleFrontmatter,
  readingTimeDetails,
} from "./lib/project.mjs";

export function checkPublicationPrerequisites(slug) {
  const errors = [];
  const articleDir = articleDirectory(slug);
  const articlePath = path.join(articleDir, "current.md");
  if (!fs.existsSync(articlePath)) return { errors: ["Не найден current.md"] };
  const articleHash = hashFile(articlePath);
  const article = fs.readFileSync(articlePath, "utf8");

  try {
    const parsed = parseArticleFrontmatter(article, "current.md");
    if (parsed.values.get("published") !== "false") {
      errors.push("published должен быть false");
    }
    if (/^#\s+/m.test(parsed.body)) errors.push("В теле статьи запрещён H1");
    const expected = readingTimeDetails(article).minutes;
    if (Number(parsed.values.get("readingTime")) !== expected) {
      errors.push(`readingTime должен быть ${expected}`);
    }
  } catch (error) {
    errors.push(error.message);
  }

  const slots = [...article.matchAll(/<!--\s*IMAGE_SLOT\b([^>]*)-->/g)].map((match) => {
    const attributes = Object.fromEntries(
      [...match[1].matchAll(/([a-zA-Z][a-zA-Z0-9-]*)="([^"]*)"/g)].map((item) => [
        item[1],
        item[2],
      ]),
    );
    return attributes;
  });
  if (slots.length === 0) errors.push("В статье нет обязательных IMAGE_SLOT");
  const slotIds = new Set();
  for (const slot of slots) {
    if (!/^img-\d{2}$/.test(slot.id ?? "")) errors.push(`Некорректный IMAGE_SLOT id: ${slot.id}`);
    if (slotIds.has(slot.id)) errors.push(`Повтор IMAGE_SLOT id: ${slot.id}`);
    slotIds.add(slot.id);
    if (!slot.role || !slot.alt || !slot.association) {
      errors.push(`IMAGE_SLOT ${slot.id ?? "без id"} заполнен не полностью`);
    }
    if (slot.role !== "video" && slot.ratio !== "16:9") {
      errors.push(`IMAGE_SLOT ${slot.id ?? "без id"} должен иметь ratio="16:9"`);
    }
  }

  const mediaPath = path.join(articleDir, "media-plan.md");
  try {
    const media = extractContract(fs.readFileSync(mediaPath, "utf8"), "MEDIA_CONTRACT");
    if (media.schemaVersion !== 2) errors.push("Медиаплан должен иметь schemaVersion 2");
    if (media.status !== "ready") errors.push("Медиаплан имеет status не ready");
    if (media.articleSha256 !== articleHash) {
      errors.push("Медиаплан относится к другой версии статьи");
    }
    const mediaSlots = Array.isArray(media.slots) ? media.slots : [];
    const mediaIds = new Set(mediaSlots.map((slot) => slot.id));
    if (mediaIds.size !== slotIds.size || [...slotIds].some((id) => !mediaIds.has(id))) {
      errors.push("IMAGE_SLOT в статье и медиаплане не совпадают");
    }
    const mediaById = new Map(mediaSlots.map((slot) => [slot.id, slot]));
    for (const slot of slots) {
      const mediaSlot = mediaById.get(slot.id);
      if (!mediaSlot) continue;
      for (const attribute of ["role", "alt", "association"]) {
        if (mediaSlot[attribute] !== slot[attribute]) {
          errors.push(`IMAGE_SLOT ${slot.id}: ${attribute} не совпадает с медиапланом`);
        }
      }
      if (slot.role !== "video" && mediaSlot.ratio !== slot.ratio) {
        errors.push(`IMAGE_SLOT ${slot.id}: ratio не совпадает с медиапланом`);
      }
    }
    const ogImage = media.ogImage;
    if (!ogImage || ogImage.ratio !== "1:1") {
      errors.push('OG-картинка должна иметь ratio="1:1"');
    } else {
      const linkedHero = slots.find(
        (slot) =>
          slot.id === ogImage.linkedSlotId &&
          slot.role === "hero" &&
          slot.ratio === "16:9",
      );
      if (!linkedHero) {
        errors.push("OG-картинка должна быть связана с существующим hero 16:9");
      } else if (!ogImage.association || ogImage.association !== linkedHero.association) {
        errors.push("OG-картинка и связанный hero должны иметь одну association");
      }
    }
  } catch (error) {
    errors.push(`Медиаплан: ${error.message}`);
  }

  const learningPath = path.join(articleDir, "learning-report.md");
  try {
    const learning = extractContract(
      fs.readFileSync(learningPath, "utf8"),
      "LEARNING_CONTRACT",
    );
    if (learning.status !== "ready") errors.push("Обучение по статье имеет status не ready");
    if (learning.articleSha256 !== articleHash) {
      errors.push("Обучение относится к другой версии статьи");
    }
    const ledger = fs.readFileSync(
      path.join(articleDir, "..", "..", "..", "memory", "article-ledger.md"),
      "utf8",
    );
    if (!ledger.includes(`<!-- article:${learning.ledgerSlug}:${articleHash} -->`)) {
      errors.push("В article-ledger.md нет записи обучения для этой версии статьи");
    }
  } catch (error) {
    errors.push(`Обучение: ${error.message}`);
  }

  return {
    errors,
    articleDir,
    articlePath,
    articleHash,
    mediaPath,
    learningPath,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = parseArgs();
  if (args._[0] !== "check" || !args.slug) {
    console.error("Использование: node scripts/publication-gate.mjs check --slug <slug>");
    process.exit(2);
  }
  const result = checkPublicationPrerequisites(args.slug);
  if (result.errors.length) {
    console.error(`Публикационный шлюз не пройден:\n${result.errors.map((item) => `- ${item}`).join("\n")}`);
    process.exit(1);
  }
  console.log("Публикационный шлюз пройден.");
}
