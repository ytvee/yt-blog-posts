#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import MarkdownIt from "markdown-it";
import { assertSlug, parseArticleFrontmatter, projectRoot, quotedFrontmatterValue } from "./lib/project.mjs";
import { assertSafePath, assertSafeTree } from "./lib/safe-path.mjs";

const escape = (value) => String(value).replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const css = `body{box-sizing:border-box;max-width:640px;margin:32px auto;padding:0 20px;background:#fff;color:#222;font:18px/1.6 system-ui,sans-serif;overflow-wrap:anywhere}h1,h2,h3{line-height:1.25}h1{font-size:2rem}a{color:#0645ad}img,video{max-width:100%;height:auto}pre{overflow-x:auto;padding:12px;background:#f5f5f5;white-space:pre;overflow-wrap:normal}code{font-size:.9em}table{display:block;overflow-x:auto;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px 10px}blockquote{margin-left:0;padding-left:16px;border-left:3px solid #ccc}`;

function document(title, body, styled = false) {
  return `<!doctype html>\n<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${escape(title)}</title>${styled ? `<style>${css}</style>` : ""}</head><body>${body}</body></html>\n`;
}

function renderer(articleDir, destination) {
  const md = new MarkdownIt({ html: true, linkify: false, typographer: false });
  const assets = new Map();
  function mediaUrl(input) {
    if (/^https?:\/\//i.test(input)) return input;
    if (/^[a-z][a-z0-9+.-]*:|^[/\\]/i.test(input)) throw new Error(`Недопустимый адрес медиа: ${input}`);
    const [, pathname, suffix] = input.match(/^([^?#]*)([\s\S]*)$/);
    const decoded = decodeURIComponent(pathname);
    const source = assertSafePath(articleDir, path.resolve(articleDir, decoded));
    if (!/\.(png|jpe?g|gif|webp|avif|mp4|webm|ogg|mov)$/i.test(source)) {
      throw new Error(`Локальное медиа имеет неподдерживаемый формат: ${input}`);
    }
    if (!fs.statSync(source).isFile()) throw new Error(`Медиа не является файлом: ${input}`);
    const relative = path.relative(articleDir, source);
    const target = path.join(destination, "media", relative);
    assets.set(target, source);
    return `media/${relative.split(path.sep).map(encodeURIComponent).join("/")}${suffix}`;
  }
  const image = md.renderer.rules.image;
  md.renderer.rules.image = (tokens, index, options, env, self) => {
    tokens[index].attrSet("src", mediaUrl(tokens[index].attrGet("src")));
    return image(tokens, index, options, env, self);
  };

  // HTML из статьи не проходит напрямую: заново создаём только разрешённые
  // конструкции. Кодовые блоки Markdown этот обработчик не затрагивает.
  function safeHtml(source) {
    return source.replace(/<!--[\s\S]*?(?:-->|$)|<[^>]*>|[^<]+|</g, (piece) => {
      if (piece.startsWith("<!--")) return "";
      if (/^<\/\s*(a|div|video)\s*>$/i.test(piece)) return piece.toLowerCase();
      const tag = piece.match(/^<(a|div|video|source)\b([\s\S]*?)\/?\s*>$/i);
      if (!tag) return escape(piece);
      const name = tag[1].toLowerCase();
      const attributes = new Map();
      const leftover = tag[2].replace(/\s+([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g, (_, key, double, single) => {
        attributes.set(key.toLowerCase(), md.utils.unescapeAll(double ?? single ?? ""));
        return "";
      });
      if (leftover.trim()) return escape(piece);
      const allowed = { a: ["id"], div: ["align"], video: ["controls", "preload", "width", "src", "poster"], source: ["src", "type"] }[name];
      if ([...attributes.keys()].some((key) => !allowed.includes(key))) return escape(piece);
      if (name === "a" && !attributes.get("id")) return escape(piece);
      if (name === "div" && attributes.get("align") !== "center") return escape(piece);
      const output = [];
      for (const [key, raw] of attributes) {
        let value = raw;
        if (key === "src" || key === "poster") value = mediaUrl(value);
        if (key === "preload" && !["none", "metadata", "auto"].includes(value)) return escape(piece);
        if (key === "width" && !/^\d+%?$/.test(value)) return escape(piece);
        if (key === "type" && !/^video\/[a-z0-9.+-]+$/i.test(value)) return escape(piece);
        output.push(key === "controls" ? "controls" : `${key}="${escape(value)}"`);
      }
      return `<${name}${output.length ? ` ${output.join(" ")}` : ""}>`;
    });
  }
  md.renderer.rules.html_block = (tokens, index) => safeHtml(tokens[index].content);
  md.renderer.rules.html_inline = (tokens, index) => safeHtml(tokens[index].content);
  return { render: (body) => md.render(body), assets };
}

// root позволяет проверять весь жизненный цикл на изолированных фикстурах.
export function buildDrafts(root = projectRoot) {
  const output = assertSafePath(root, path.join(root, "_site"));
  if (fs.existsSync(output)) {
    assertSafeTree(root, output);
    fs.rmSync(output, { recursive: true });
  }
  fs.mkdirSync(output, { recursive: true });
  const articles = assertSafePath(root, path.join(root, "work", "articles"));
  const drafts = [];
  for (const entry of fs.readdirSync(articles, { withFileTypes: true })) {
    const articleDir = assertSafePath(articles, path.join(articles, entry.name));
    if (!entry.isDirectory()) continue;
    const source = assertSafePath(articleDir, path.join(articleDir, "current.md"));
    if (!fs.existsSync(source)) continue;
    const slug = assertSlug(entry.name);
    const { values, body } = parseArticleFrontmatter(fs.readFileSync(source, "utf8"), slug);
    const title = quotedFrontmatterValue(values, "title");
    if (!title.trim() || values.get("published") !== "false") throw new Error(`${slug}: нужны title и published: false`);
    const destination = path.join(output, "drafts", slug);
    const markdown = renderer(articleDir, destination);
    const rendered = markdown.render(body);
    fs.mkdirSync(destination, { recursive: true });
    for (const [target, file] of markdown.assets) {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(file, target);
    }
    fs.writeFileSync(path.join(destination, "index.html"), document(title,
      `<nav><a href="../../">Все черновики</a></nav><main><p>Черновик</p><h1>${escape(title)}</h1>${rendered}</main>`, true));
    drafts.push({ slug, title });
  }
  drafts.sort((a, b) => a.title.localeCompare(b.title, "ru") || a.slug.localeCompare(b.slug));
  const list = drafts.length ? `<ul>${drafts.map(({ slug, title }) => `<li><a href="drafts/${slug}/">${escape(title)}</a></li>`).join("")}</ul>` : "<p>Черновиков пока нет.</p>";
  fs.writeFileSync(path.join(output, "index.html"), document("Черновики", `<h1>Черновики</h1>${list}`));
  return drafts;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(`Сборка _site/ готова. Черновиков: ${buildDrafts().length}.`);
  } catch (error) {
    console.error(`Страницы не собраны: ${error.message}`);
    process.exitCode = 1;
  }
}
