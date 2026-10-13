---
local_only: true
publishable: false
---

# Продолжить проверку статьи об AWS-деплое

Дата передачи контекста: 2026-09-28.

## Статус и задача

Сейчас сохранены задача и текстовые наблюдения по 9 скриншотам пользователя (7 S3/CloudFront + 2 CodeBuild). **Исходные изображения не скопированы: доступные файлы вложений и Downloads проверены, соответствующие оригиналы не найдены.** Описания ниже не заменяют изображения. Попросить пользователя прикрепить оригиналы файлами или указать их папку, затем скопировать без изменений в `aws-article-review/screenshots/` и проверить открытие каждого файла.

Следующий этап по запросу пользователя: проверить статью и текущий проект — всё ли правильно и достаточно подробно раскрыто; исправить ошибки и дополнить объяснения, примеры и демонстрации, используя логи, скриншоты и официальную документацию. **Только развёртывание на AWS, без инструкций по локальному запуску.**

На этапе сохранения статья не редактировалась, приложение и AWS не изменялись. Не публиковать материалы, не выполнять деплой, не коммитить заметку и инфраструктурные скриншоты автоматически. Метка local_only сама по себе не исключает файлы из Git.

## Где находятся материалы

Все перечисленные ниже исходные пути проверены при сохранении заметки и существуют:

- Статья: `C:\Users\yt\Desktop\DEV\yt-blog-posts\DRAFTS\aws-codebuild-npm-s3-cloudfront.md`.
- Рабочая копия: `C:\Users\yt\Desktop\DEV\yt-blog-posts\work\articles\aws-codebuild-npm-s3-cloudfront\current.md`.
- Бриф: `C:\Users\yt\Desktop\DEV\yt-blog-posts\work\articles\aws-codebuild-npm-s3-cloudfront\brief.md`.
- Проект: `C:\Users\yt\Desktop\SNET\asi-create-ai-foundry`.
- Логи CSV: `C:\Users\yt\Downloads\log-events-viewer-result.csv`.
- Фрагмент логов 1: `C:\Users\yt\.codex\attachments\a85f3ac2-ff1d-44fc-b1f6-3428b8c10378\pasted-text.txt`.
- Фрагмент логов 2: `C:\Users\yt\.codex\attachments\288412cd-7b22-4630-9381-59b9ff391a42\pasted-text.txt`.
- Фрагмент логов 3: `C:\Users\yt\.codex\attachments\f6a66ed7-57f5-4cb0-afb9-df17326647fd\pasted-text.txt`.
- Фрагмент логов 4: `C:\Users\yt\.codex\attachments\7395bd8c-be9d-491e-a353-2dac44a7234e\pasted-text.txt`.

SHA256 статьи до сохранения этой заметки: `0A8188A7E201C2B135D5D07B338F91257FFEC23362A254EF0BC8CA8B7139E428`.

Реестр ожидаемых изображений: [aws-article-review/screenshots/INVENTORY.md](aws-article-review/screenshots/INVENTORY.md). Имена в реестре — запланированные, а не ссылки на уже сохранённые PNG.

## Подтверждения из скриншотов

### S3 — отдельный бакет данных

Первые три кадра относятся к `asi-create-agent-backups-stage`, а **не** к бакету сборки фронтенда `asi-create-ai-foundry-stage-dist`.

- Показаны префиксы `agent_backups/`, `chat-attachments/`, `omegaclaw_knowledge/`.
- Регион `us-east-1`; Versioning, MFA delete и ABAC — Disabled; пользовательских тегов нет.
- Default encryption — SSE-S3. Отдельно UI показывает Bucket Key Enabled и SSE-C в Blocked encryption types. Не делать вывод о применении SSE-KMS из одного поля Bucket Key.
- Показаны 0 Intelligent-Tiering Archive configurations и 0 Log delivery to CloudWatch. Не расширять это до утверждения об отсутствии любых логов или правил жизненного цикла.
- Эти настройки не доказывают аналогичные настройки frontend dist-бакета.

### CloudFront — omega-cloud-stage

- Один origin типа **S3 static website**, домен `asi-create-ai-foundry-stage-dist.s3-website-us-east-1.amazonaws.com`. Origin groups отсутствуют. Не описывать текущий origin как приватный S3 REST origin с OAC.
- Default behavior: Redirect HTTP to HTTPS; Compress objects automatically — No; Cache policy — `Managed-CachingOptimized`; Origin request policy — `Managed-CORS-S3Origin`.
- Название Response headers policy обрезано: не восстанавливать догадками.
- На Viewer request есть ассоциация **Lambda@Edge**. ARN обрезан, код и назначение функции неизвестны. На Viewer response, Origin request и Origin response ассоциаций не показано.
- Logging: стандартных access log destinations нет; real-time logging у показанного default behavior выключен, сама distribution включена.
- Теги: Environment=Stage, Layer=Frontend, Name=omega-cloud-stage.
- Надпись Billing / Missing permissions относится к отображению billing в консоли и не доказывает проблему прав у CodeBuild.

### CodeBuild — сборка № 423

- Проект `asi-create-ai-foundry-stage`; статус Succeeded.
- Source provider: GitHub; Git clone depth: Full; Git submodules: False.
- Source version и Resolved source version: `1853493363ccee432458269c66764898b8c2d5e8`. Перед сравнением проверить точность SHA по доступной истории Git; сам checkout не переключать без необходимости.
- Initiator: `GitHub-Hookshot/acca5e9`. Это свидетельство запуска через GitHub webhook; тип события, ветка и фильтры на скриншоте не показаны. Наличие CodePipeline не установлено.
- Image: `aws/codebuild/standard:8.0`; Environment type: Linux Container; Compute type: EC2; Compute: 2 vCPUs, 4 GiB memory.
- Privileged: False; Timeout: 5 minutes; Queued timeout: 8 hours; Cache type: No cache.
- Service role и некоторые другие поля закрашены пользователем — не восстанавливать их. Секции VPC и Environment variables свернуты, их содержимое неизвестно.
- Начало 28 сентября 2026, 17:29, завершение 17:31, UTC+03:00. Логи с 14:29 сопоставлять с учётом часового пояса, не считать расхождение ошибкой без проверки.
- Длительности из Phase details: PROVISIONING 3 с, DOWNLOAD_SOURCE 7 с, INSTALL 43 с, BUILD 67 с. SUBMITTED, QUEUED, PRE_BUILD, POST_BUILD, UPLOAD_ARTIFACTS и FINALIZING — менее секунды; у COMPLETED длительность не указана.
- В исходном buildspec `npm install` находится в BUILD, а не INSTALL. Наличие фазы в UI не означает наличие пользовательских команд в ней. UPLOAD_ARTIFACTS не следует путать с явной загрузкой `dist` через AWS CLI внутри BUILD.

## Контекст сборки из предыдущего обсуждения — перепроверить по исходникам

Последовательность присланного buildspec: скачать конфигурацию из S3 → прочитать NODE_VERSION из `.env` → выбрать Node через `n` → создать `.npmrc` для GitHub Packages → `npm install --verbose` → `npm run build` → перейти в `dist` → `aws s3 sync . s3://"$BUCKET_NAME"/ --delete` → создать CloudFront invalidation `/*`.

Ключевые темы для проверки: dependencies и devDependencies в сборочном контейнере; npm install и npm ci; lockfile и фактически собранный коммит; GitHub Packages и GH_TOKEN; Node/npm и образ CodeBuild; Vite и публичные VITE-переменные; генерация email templates; публикация статических файлов; асинхронная invalidation; кеширование и удаление старых чанков.

Не путать временный контейнер сборки с постоянно работающим контейнером приложения. Показанная цепочка публикует статический frontend в S3/CloudFront. Lambda@Edge — дополнительный код обработки запросов, но его роль ещё не выяснена. Отдельный Dockerfile репозитория не доказывает использование Docker-деплоя в этой цепочке.

## Порядок продолжения

1. Прочитать инструкции текущего проекта и репозитория блога, использовать применимый workflow редактирования статьи; сохранить предыдущую версию перед правками.
2. Получить исходники 9 изображений и сверить их с реестром. Сохранить оригиналы, не реконструировать их по тексту. Перед публичным использованием подготовить отдельно согласованные обезличенные копии.
3. Сопоставить статью, текущие конфиги и исходники коммита AWS; при отсутствии коммита локально явно отметить пробел, не выдавать текущий checkout за исходники сборки № 423.
4. Уточнить новые факты об образе, webhook и длительностях. Проверить соответствующие официальные источники AWS, npm и Vite с учётом версий проекта.
5. Проверить пояснения website origin vs REST origin/OAC, Lambda@Edge, сжатия и логов. Vite gzip-size — оценка, а не подтверждение фактического HTTP Content-Encoding. Не назначать Lambda@Edge роль SPA rewrite без кода функции.
6. Улучшить статью и согласованно обновить рабочую копию по правилам блога. Не публиковать и не менять AWS. Проверить ссылки, примеры и отсутствие секретов/внутренних идентификаторов в публичном тексте.

Команда для возобновления в новой беседе: «Прочитай AWS-ARTICLE-RESUME.md в корне проекта и продолжи проверку и улучшение статьи по сохранённой задаче. Сначала проверь статус исходных скриншотов».
