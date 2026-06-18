# Redeploy Workflow

This repository triggers a full production rebuild of the external blog project
through GitHub Actions.

## Purpose

- a new or updated post is pushed here
- GitHub Actions sends a `repository_dispatch` event to `ytvee/yt-blog`
- the blog repository runs its deploy workflow
- the blog workflow builds the app and deploys it with `railway up --ci`

This repository does not build or validate the external app runtime.

## Workflow File

- `.github/workflows/redeploy-blog.yml`

## Trigger Contract

- trigger on `push` to `main`
- only run automatically when `content/**`, `media/**`, or the workflow file
  changes
- allow manual runs through `workflow_dispatch`
- prevent overlapping notification jobs through workflow concurrency

## Secret Contract

Required GitHub Actions secret in this repository:

- `BLOG_REPO_DISPATCH_TOKEN`

Important:

- this is a GitHub repository secret, not a Railway environment variable
- the token must be able to create repository dispatch events in `ytvee/yt-blog`
- the target blog repository must contain a workflow listening for
  `repository_dispatch` event type `posts_updated`

## External Blog Workflow Contract

The external `yt-blog` repository owns the production deploy.

That workflow should:

- run on `repository_dispatch` type `posts_updated`
- run on manual `workflow_dispatch`
- run on `push` to `main` for blog-app source changes
- install dependencies with `npm ci`
- run the blog verification/build commands
- deploy with `railway up --ci`

Required GitHub Actions secrets in the external `yt-blog` repository:

- `GITHUB_CONTENTS_TOKEN`
- `SITE_URL`
- `RAILWAY_TOKEN`
- `RAILWAY_PROJECT_ID`
- `RAILWAY_SERVICE_NAME`

Optional analytics secrets in the external `yt-blog` repository:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_YANDEX_METRIKA_ID`

## Railway Settings

- Disable Railway GitHub Autodeploy for the production `yt-blog` service when
  GitHub Actions owns deploys.
- Disable Railway Skipped Builds if it was enabled for the production service.
- Do not use `railway redeploy` as the publication path for new posts.

## Common Failure Modes

- the workflow file was changed locally but not pushed to `main`
- `BLOG_REPO_DISPATCH_TOKEN` is missing or does not have access to `ytvee/yt-blog`
- the external blog workflow is missing or does not listen for `posts_updated`
- the external blog repository is missing Railway or content secrets
- Railway GitHub Autodeploy is still enabled and creates duplicate deploys
- Railway Skipped Builds is enabled and reuses a stale build

## Debug Rule

When publication fails, debug this chain in order:

1. the `yt-blog-posts` notify workflow ran
2. `repository_dispatch` started the `yt-blog` deploy workflow
3. the `yt-blog` workflow build saw fresh GitHub content
4. `railway up --ci` created a new Railway deployment

Do not claim the external app itself is broken unless there is separate
evidence from the blog workflow or Railway deployment logs.
