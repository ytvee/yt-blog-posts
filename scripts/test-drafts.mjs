import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildDrafts } from "./build-drafts.mjs";
import { cleanupPublishedArticle, publicationPaths, resumePublicationCleanup } from "./lib/publication-cleanup.mjs";
import { hashFile } from "./lib/project.mjs";
import { assertSafeTree } from "./lib/safe-path.mjs";

export function testDrafts() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "yt-drafts-"));
  const articles = path.join(root, "work", "articles");
  const output = path.join(root, "_site");
  const source = (slug) => path.join(articles, slug, "current.md");
  const read = (file) => fs.readFileSync(path.join(output, file), "utf8");
  const write = (slug, title, body = "Текст.") => {
    fs.mkdirSync(path.join(articles, slug), { recursive: true });
    fs.writeFileSync(source(slug), `---\ntitle: ${JSON.stringify(title)}\npublished: false\n---\n\n${body}`);
  };
  try {
    fs.mkdirSync(articles, { recursive: true });
    buildDrafts(root);
    assert.match(read("index.html"), /Черновиков пока нет/);
    write("second", "Я — второй");
    write("first", 'А <первый> & "тест"', `
[Раздел](#раздел)

<a id="раздел"></a>

## Раздел

**Жирный**, *курсив*, [сайт](https://example.com), \`inline\`.

- Один
- Два

1. Первый
2. Второй

> Цитата

| A | B |
| - | - |
| 1 | 2 |

\`\`\`html
<script>code only</script>
\`\`\`

<!-- IMAGE_SLOT association="секретный комментарий" -->

<div align="center">* * *</div>

![Картинка](images/a%20b.png)

<video controls preload="metadata" width="100%">
<source src="clip.mp4" type="video/mp4" />
</video>

<script>alert(1)</script>

<a id="bad" onclick="alert(1)"></a>
`);
    fs.mkdirSync(path.join(articles, "first", "images"));
    fs.writeFileSync(path.join(articles, "first", "images", "a b.png"), "image bytes");
    fs.writeFileSync(path.join(articles, "first", "clip.mp4"), "video bytes");
    fs.writeFileSync(path.join(articles, "first", "brief.md"), "PRIVATE BRIEF");
    fs.mkdirSync(path.join(articles, "first", "revisions"));
    fs.writeFileSync(path.join(articles, "first", "revisions", "000-initial.md"), "PRIVATE HISTORY");
    fs.mkdirSync(path.join(root, "DRAFTS"));
    fs.writeFileSync(path.join(root, "DRAFTS", "ignored.md"), "LEGACY DRAFT");
    assert.equal(buildDrafts(root).length, 2);
    const index = read("index.html");
    assert(index.indexOf("drafts/first/") < index.indexOf("drafts/second/"));
    assert(!index.includes("<style>"));
    const page = read("drafts/first/index.html");
    for (const expected of ['id="раздел"', 'href="#', "<h2>Раздел</h2>", "<strong>", "<em>", "<ul>", "<ol>", "<blockquote>", "<table>", "<pre>", 'href="../../"', "А &lt;первый&gt; &amp; &quot;тест&quot;", 'src="media/images/a%20b.png"', 'src="media/clip.mp4"', '<div align="center">']) {
      assert(page.includes(expected), `Нет ожидаемой разметки: ${expected}`);
    }
    assert(!page.includes("IMAGE_SLOT") && !page.includes("секретный комментарий"));
    assert(!page.includes("<script>") && !page.includes('<a id="bad" onclick='));
    assert.equal(read("drafts/first/media/images/a b.png"), "image bytes");
    assert(!fs.existsSync(path.join(output, "drafts", "first", "brief.md")));
    assert(!fs.existsSync(path.join(output, "drafts", "first", "revisions")));
    assert(!index.includes("ignored"));

    write("first", "Обновлённый", "Новая версия");
    buildDrafts(root);
    assert.match(read("drafts/first/index.html"), /Новая версия/);
    assert(!fs.existsSync(path.join(output, "drafts", "first", "media")));
    fs.mkdirSync(path.join(root, "content"));
    const target = path.join(root, "content", "first.md");
    fs.writeFileSync(target, "Несовпадающая копия");
    assert.throws(() => cleanupPublishedArticle("first", hashFile(source("first")), root), /SHA-256/);
    assert(fs.existsSync(source("first")));
    fs.copyFileSync(source("first"), target);
    const publishedHash = hashFile(target);
    assert.throws(() => publicationPaths("../second", root), /kebab-case/);

    // Ссылки проверяем на каталогах: Windows junction не требует Developer Mode.
    const link = path.join(articles, "first", "linked");
    fs.symlinkSync(path.join(articles, "second"), link, process.platform === "win32" ? "junction" : "dir");
    assert.throws(() => cleanupPublishedArticle("first", publishedHash, root), /Символическая ссылка/);
    fs.unlinkSync(link);
    const realRemove = fs.rmSync;
    try {
      fs.rmSync = () => {
        fs.unlinkSync(source("first"));
        throw new Error("Тестовый отказ удаления");
      };
      assert.throws(() => cleanupPublishedArticle("first", publishedHash, root), /отказ удаления/);
    } finally { fs.rmSync = realRemove; }
    assert.equal(hashFile(target), publishedHash);
    assert(!fs.existsSync(source("first")));
    const briefPath = path.join(articles, "first", "brief.md");
    fs.writeFileSync(briefPath, "Новая правка после ошибки");
    assert.throws(() => resumePublicationCleanup("first", root), /изменён рабочий файл/);
    fs.writeFileSync(briefPath, "PRIVATE BRIEF");
    assert.equal(resumePublicationCleanup("first", root), publishedHash);
    assert.equal(resumePublicationCleanup("first", root), null);
    assert(!fs.existsSync(path.join(articles, "first")));
    assert(fs.existsSync(source("second")));
    buildDrafts(root);
    assert(!fs.existsSync(path.join(output, "drafts", "first")));
    assert(!read("index.html").includes("drafts/first/"));
    assert(read("index.html").includes("drafts/second/"));

    for (const url of ["../first/image.png", "../../outside.png", "brief.md", "https:bad", "file:///tmp/a.png"]) {
      write("second", "Ошибка медиа", `![Изображение](${url})`);
      // markdown-it сам отклоняет file: — он остаётся обычным текстом.
      if (url.startsWith("file:")) {
        buildDrafts(root);
        assert(!read("drafts/second/index.html").includes('<img src="file:'));
      } else assert.throws(() => buildDrafts(root));
    }
    write("second", "Видео", '<video src="javascript:alert(1)"></video>');
    assert.throws(() => buildDrafts(root), /Недопустимый адрес/);
    console.log("Проверки предпросмотра и изолированного удаления пройдены.");
  } finally {
    assertSafeTree(os.tmpdir(), root);
    fs.rmSync(root, { recursive: true });
  }
}
