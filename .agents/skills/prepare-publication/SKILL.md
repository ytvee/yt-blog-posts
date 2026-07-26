---
name: prepare-publication
description: "Проверяет апрув, медиаплан и обучение, затем создаёт идемпотентную очередь доставки черновика в ytvee/yt-blog-posts. Использовать только после явного утверждения финальной статьи пользователем."
---

# Подготовить публикацию

1. Убедиться, что пользователь явно утвердил текущую версию.
2. Получить и показать пользователю английский lowercase kebab-case slug. Он становится именем файла и частью URL.
3. Проверить:

```powershell
node scripts/validate-project.mjs work/articles/<slug>/current.md
node scripts/publication-gate.mjs check --slug <slug>
```

4. Создать очередь только командой:

```powershell
node scripts/prepare-publication.mjs --slug <slug> --english-slug <english-slug> --approved-by user
```

5. Сообщить путь очереди и напомнить, что пользователь вручную делает commit и push текущего репозитория.

Не менять `published: false`. Не удалять рабочий каталог. Удаление выполняет GitHub Action только после успешного push целевого файла в `ytvee/yt-blog-posts`.
