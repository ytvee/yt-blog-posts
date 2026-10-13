# Бриф статьи

- Рабочее название: «Что происходит с фронтендом при деплое в AWS: разбираем CodeBuild, npm, S3 и CloudFront по логам».
- Slug: `aws-codebuild-npm-s3-cloudfront`.
- Режим: экспертно-практический материал, подробная статья-лекция.
- Цель: объяснить фактическую AWS-цепочку проекта и дать воспроизводимый план демонстрации через AWS и браузер опубликованного сайта.
- Основной вопрос: как исходники и npm-пакеты превращаются в опубликованный фронтенд в конкретном CodeBuild-деплое?
- Читатель: frontend-разработчик, знакомый с JavaScript, но не уверенный в устройстве AWS-деплоя.
- Объём: развёрнутая лекция с примерами, разбором команд, логов, ошибок и списком чтения.
- Тон: живое объяснение коллеге, точные причинно-следственные связи, без выдуманного личного опыта.

## Материал автора

Переданы buildspec 0.2, четыре текстовых фрагмента CloudWatch/npm-логов и CSV с окончанием S3 sync и CloudFront invalidation от 2026-09-28. Автор просит только AWS, без локального запуска. Прямое указание результата: сохранить статью в `DRAFTS`.

Статья в `DRAFTS/aws-codebuild-npm-s3-cloudfront.md` — копия рабочей версии. Пользовательский путь имеет приоритет над стандартным размещением только в work. В content материал не переносится, апрув публикации не запрашивается. Бриф и неизменяемый первый снимок сохраняются по write-post.

Защищённый смысл авторского запроса: подробно объяснить зависимости, dev-зависимости, образ и последовательность работы контейнера на AWS; дать примеры и демонстрации. Разговорное «как и что у нас при деплое работает» задаёт уровень конкретности. Личных историй, инцидентов и результатов оптимизации автор не предоставил.

## Источники и факты

| Утверждение | Статус | Источник |
|---|---|---|
| CodeBuild On-demand, GitHub source, два блока команд INSTALL/BUILD | подтверждено | Buildspec и логи автора |
| Node 24.14.0, npm 11.9.0, Vite 6.4.3 | подтверждено | Логи автора |
| Установлено 673, audited 674, 21 секунда, 5 moderate | подтверждено | Четвёртый текстовый фрагмент |
| 17 email templates, Vite 15.72s, chunk 723.66 kB | подтверждено | Фрагменты в исходном сообщении автора |
| CloudFront InProgress при завершении BUILD | подтверждено | CSV автора |
| 44 dependencies, 25 devDependencies, 722 lock entries | подтверждено | Текущие package.json/package-lock.json |
| Текущий checkout тождественен AWS source revision | требует проверки | AWS commit SHA не предоставлен |
| Текущий checkout a5e0c49821bd0eb581d6a02f6aefcf2f79193ab4 | подтверждено | git rev-parse HEAD при подготовке |
| tsc -b → vite build → replace-env.js; noEmit; HashRouter | подтверждено | package.json, tsconfig, replace-env.js, src/App.tsx |
| Dockerfile приложения не вызывается показанным buildspec | подтверждено | Переданные команды, отсутствие docker build/push |
| Конкретный CodeBuild image/tag, trigger, IAM, origin/cache policy | требует проверки | Настройки AWS не переданы |
| CodePipeline используется | требует проверки | По логам CodeBuild установить нельзя |
| Dev-инструменты присутствуют, но полный эффективный npm config неизвестен | подтверждено | npm downloads и успешный запуск сборки; env проекта отсутствует |
| Разница 722 и 673 полностью объяснена optional deps | требует проверки | Нет exact AWS lockfile и полного дерева установки; не утверждать |
| Улучшения buildspec и учебные эксперименты | мнение | Предложения статьи, не применялись и не запускались |

## Проверенные первичные источники

Проверены 2026-09-28. Для Vite используется документация версии 6. Для чувствительных к версии нюансов npm используются файлы документации тега v11.9.0. Движущаяся документация /cli/v11 может описывать более поздний minor; не переносить новую install-script policy на исторический запуск.

- https://docs.aws.amazon.com/codebuild/latest/userguide/concepts.html
- https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref.html
- https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html
- https://docs.aws.amazon.com/codebuild/latest/userguide/create-project.html
- https://docs.aws.amazon.com/codebuild/latest/userguide/build-caching.html
- https://docs.aws.amazon.com/codepipeline/latest/userguide/concepts.html
- https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html
- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Invalidation.html
- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Expiration.html
- https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html
- https://docs.aws.amazon.com/cli/latest/reference/cloudfront/wait/invalidation-completed.html
- https://raw.githubusercontent.com/npm/cli/v11.9.0/docs/lib/content/commands/npm-install.md
- https://raw.githubusercontent.com/npm/cli/v11.9.0/docs/lib/content/commands/npm-ci.md
- https://raw.githubusercontent.com/npm/cli/v11.9.0/docs/lib/content/using-npm/scripts.md
- https://raw.githubusercontent.com/npm/cli/v11.9.0/workspaces/config/lib/definitions/definitions.js
- https://docs.npmjs.com/cli/v11/configuring-npm/package-json/
- https://docs.npmjs.com/cli/v11/configuring-npm/package-lock-json/
- https://docs.npmjs.com/cli/v11/configuring-npm/npmrc/
- https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- https://github.com/tj/n
- https://v6.vite.dev/guide/build
- https://v6.vite.dev/guide/env-and-mode
- https://v6.vite.dev/config/build-options
- https://docs.aws.amazon.com/codebuild/latest/userguide/build-env-ref-env-vars.html
- https://reactrouter.com/api/declarative-routers/HashRouter

## Заголовки

1. Что происходит с фронтендом при деплое в AWS: разбираем CodeBuild, npm, S3 и CloudFront по логам.
2. Зачем AWS устанавливает devDependencies перед публикацией фронтенда.
3. Две минуты CodeBuild: как React-приложение попадает в S3.
4. От npm install до CloudFront: разбираем один AWS-деплой.
5. Где живёт React после завершения CodeBuild.
6. Почему зелёный CodeBuild ещё не означает обновлённый сайт.
7. Что делает контейнер CodeBuild, пока собирается наш фронтенд.
8. Как читать AWS buildspec, если раньше смотрел только на npm run build.

Выбран № 1: охватывает подтверждённую цепочку и формат лекции. № 2, 5, 6 и 7 подходят отдельным разделам. № 3 не должен обещать полную длительность запуска: ранние фазы не представлены.

## Структура и опора

1. Лог установки как вход в тему — author: логи npm.
2. Карта AWS и образ контейнера — buildspec + AWS concepts/environment.
3. Построчный buildspec — author: buildspec + AWS specification.
4. npm graph, semver, lockfile, registries — package.json/lock + npm/GitHub docs.
5. dependencies/devDependencies/build runtime — scripts + npm v11.9.0.
6. Сборка, env, email templates — исходники + Vite 6.
7. S3, CloudFront, кеши, HashRouter — CSV + AWS docs + App.tsx.
8. Таймлайн, улучшения и ошибки — логи; предложения явно отделены.
9. Демонстрации, самопроверка, план чтения — собственные учебные примеры на базе подтверждённых механизмов.

## Редакторские ограничения

- Не описывать локальный запуск или Docker Compose.
- Не публиковать реальные bucket names, distribution IDs, account IDs, домены API, env values, персональные пути и токены. В обучающих фрагментах использовать переменные и example.com.
- Не делать вывода об устройстве backend из frontend buildspec.
- Не представлять пример улучшенного buildspec как применённый или проверенный в AWS.
- Не приписывать автору уже проведённые демонстрации.
- Не включать иллюстрации и публикационный процесс до отдельной работы над одобрением статьи; текстовые схемы входят в сам учебный материал.

## Редакторская проверка

Применены write-post, ru-text и ручной аудит humanizer-ru с приоритетом правил проекта. Проверяются конкретность начала, причинность технических объяснений, отсутствие выдуманного опыта, смешения runtime/build time, повторов и искусственных выводов. Скрипт Python не используется.
