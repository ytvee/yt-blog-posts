import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
);

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

export function hashObject(value) {
  return sha256(stableJson(value));
}

export function hashFile(filePath) {
  return sha256(fs.readFileSync(filePath));
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export function assertSlug(value, label = "slug") {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value ?? "")) {
    throw new Error(`${label} должен быть lowercase kebab-case`);
  }
  return value;
}

export function articleDirectory(slug) {
  assertSlug(slug);
  return path.join(projectRoot, "work", "articles", slug);
}

export function parseArgs(argv = process.argv.slice(2)) {
  const result = { _: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) {
      result._.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[index + 1];
    const value = next && !next.startsWith("--") ? argv[++index] : true;
    if (result[key] === undefined) result[key] = value;
    else if (Array.isArray(result[key])) result[key].push(value);
    else result[key] = [result[key], value];
  }
  return result;
}

export function asArray(value) {
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function loadDotEnv() {
  const filePath = path.join(projectRoot, ".env");
  if (!fs.existsSync(filePath)) return;
  for (const sourceLine of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const line = sourceLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

export function requireEnv(names) {
  const missing = names.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new Error(`Не настроены переменные окружения: ${missing.join(", ")}`);
  }
}

export function makeEnvelope(provider, payload) {
  const envelope = {
    schemaVersion: 1,
    provider,
    capturedAt: new Date().toISOString(),
    payload,
  };
  return { ...envelope, sha256: hashObject(envelope) };
}

export function verifyEnvelope(envelope, label) {
  if (!envelope || envelope.schemaVersion !== 1 || !envelope.sha256) {
    throw new Error(`${label}: повреждён контракт сырого ответа`);
  }
  const { sha256: expected, ...unsigned } = envelope;
  const actual = hashObject(unsigned);
  if (actual !== expected) {
    throw new Error(`${label}: SHA-256 не совпадает, данные могли быть изменены`);
  }
}

export function extractContract(text, name) {
  const expression = new RegExp(`<!--\\s*${name}\\s*\\n([\\s\\S]*?)\\n\\s*-->`);
  const match = text.match(expression);
  if (!match) throw new Error(`Не найден блок ${name}`);
  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`Блок ${name} содержит некорректный JSON: ${error.message}`);
  }
}

export function replaceContract(text, name, contract) {
  const expression = new RegExp(`<!--\\s*${name}\\s*\\n[\\s\\S]*?\\n\\s*-->`);
  const replacement = `<!-- ${name}\n${JSON.stringify(contract, null, 2)}\n-->`;
  if (!expression.test(text)) throw new Error(`Не найден блок ${name}`);
  return text.replace(expression, replacement);
}

export function parseArticleFrontmatter(text, label = "статья") {
  const normalized = text.replace(/^\uFEFF/, "");
  const match = normalized.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${label}: не найден фронтматтер`);
  const values = new Map();
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/);
    if (!field) throw new Error(`${label}: неподдерживаемая строка: ${line}`);
    values.set(field[1], field[2]);
  }
  return { values, body: normalized.slice(match[0].length), block: match[0] };
}

export function quotedFrontmatterValue(values, key) {
  const source = values.get(key);
  if (source === undefined) return "";
  try {
    const parsed = JSON.parse(source);
    return typeof parsed === "string" ? parsed : "";
  } catch {
    return "";
  }
}

export function updateReadingTime(text, minutes) {
  const parsed = parseArticleFrontmatter(text);
  if (!parsed.values.has("readingTime")) {
    throw new Error("Во фронтматтере нет readingTime");
  }
  return text.replace(/^readingTime:\s*.*$/m, `readingTime: ${minutes}`);
}

export function readingTimeDetails(text) {
  const { body } = parseArticleFrontmatter(text);
  const imageSlots = [...body.matchAll(/<!--\s*IMAGE_SLOT\b[^>]*\brole="([^"]+)"/g)].filter(
    (match) => match[1] !== "video",
  ).length;
  const markdownImages = (body.match(/!\[[^\]]*]\([^)]*\)/g) ?? []).length;
  const htmlImages = (body.match(/<img\b/gi) ?? []).length;
  const withoutMarkup = body
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[`*_>#~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const readableCharacters = [...withoutMarkup].length;
  const images = imageSlots + markdownImages + htmlImages;
  const rawMinutes = readableCharacters / 1500 + images * 0.2;
  const floor = Math.floor(rawMinutes);
  const minutes = Math.max(1, rawMinutes - floor >= 0.3 ? Math.ceil(rawMinutes) : floor);
  return { readableCharacters, images, rawMinutes, minutes };
}

export async function fetchJson(url, options, label) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  let response;
  try {
    response = await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    throw new Error(`${label}: сетевая ошибка: ${error.message}`);
  } finally {
    clearTimeout(timer);
  }
  const responseText = await response.text();
  let body;
  try {
    body = responseText ? JSON.parse(responseText) : {};
  } catch {
    throw new Error(`${label}: API вернул не JSON (HTTP ${response.status})`);
  }
  if (!response.ok) {
    const detail = body?.error?.message ?? body?.message ?? JSON.stringify(body).slice(0, 300);
    throw new Error(`${label}: HTTP ${response.status}: ${detail}`);
  }
  return { body, headers: Object.fromEntries(response.headers.entries()), status: response.status };
}

export function normalizedResearchHash(normalized) {
  const { researchSha256: _ignored, ...unsigned } = normalized;
  return hashObject(unsigned);
}

export function verifyNormalized(normalized) {
  if (normalized.schemaVersion !== 1 || !normalized.researchSha256) {
    throw new Error("normalized.json: повреждён контракт");
  }
  if (normalizedResearchHash(normalized) !== normalized.researchSha256) {
    throw new Error("normalized.json: SHA-256 не совпадает");
  }
}

export function actualKeywordSet(normalized) {
  const result = new Set();
  for (const provider of Object.values(normalized.providers ?? {})) {
    for (const country of provider.countries ?? []) {
      for (const item of country.keywords ?? []) {
        if (item.keyword) result.add(item.keyword.trim().toLocaleLowerCase("ru"));
      }
    }
  }
  return result;
}
