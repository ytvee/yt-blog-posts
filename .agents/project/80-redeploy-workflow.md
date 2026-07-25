# Redeploy Workflow

This repository triggers a full production rebuild of the external blog project
through GitHub Actions and Cloudflare Workers Builds.

## Purpose

- a new or updated post is pushed here
- GitHub Actions sends a `repository_dispatch` event to `ytvee/yt-blog`
- the blog repository receives the `posts_updated` event
- the blog workflow calls a Cloudflare Deploy Hook for the `main` branch
- Cloudflare rebuilds and deploys the `yt-blog` Worker to production

This repository does not build or validate the external app runtime.

## Workflow File

- `.github/workflows/redeploy-blog.yml`

## Trigger Contract

- trigger on `push` to `main`
- run for every push to `main`
- allow manual runs through `workflow_dispatch`
- prevent overlapping notification jobs through workflow concurrency

## Secret Contract

Required GitHub Actions secret in this repository:

- `BLOG_REPO_DISPATCH_TOKEN`

Important:

- this is a GitHub repository secret, not a Cloudflare variable
- use a fine-grained token restricted to `ytvee/yt-blog`
- the token needs `Contents: write` permission to create repository dispatch
  events
- the target blog repository must contain a workflow listening for
  `repository_dispatch` event type `posts_updated`

## External Blog Workflow Contract

The external `yt-blog` repository owns the production redeploy trigger.

Its `.github/workflows/redeploy.yml` workflow should:

- run on `repository_dispatch` type `posts_updated`
- allow manual runs through `workflow_dispatch`
- read `CLOUDFLARE_DEPLOY_HOOK_URL` from a GitHub Actions secret
- send an authenticated-by-URL `POST` request to the Cloudflare Deploy Hook
- fail when the secret is missing or Cloudflare returns a non-success response

Required GitHub Actions secret in `ytvee/yt-blog`:

- `CLOUDFLARE_DEPLOY_HOOK_URL`

The hook URL is a bearer secret and must not be committed to either repository.

## Cloudflare Workers Builds Contract

The `yt-blog` Worker should remain connected to `ytvee/yt-blog` with:

- production branch: `main`
- build command: `npm run build:cloudflare`
- deploy command: `npx wrangler deploy`
- root directory: `/`
- a Deploy Hook bound to `main`
- build-time content credentials configured as secret environment variables

Pushes to `yt-blog/main` continue to deploy through the normal Cloudflare Git
integration. The Deploy Hook exists for content changes that originate in this
separate posts repository.

## Common Failure Modes

- the workflow file was changed locally but not pushed to `main`
- `BLOG_REPO_DISPATCH_TOKEN` is missing, expired, or lacks access to
  `ytvee/yt-blog`
- the external blog workflow is missing or does not listen for `posts_updated`
- `CLOUDFLARE_DEPLOY_HOOK_URL` is missing from `ytvee/yt-blog`
- the Deploy Hook was deleted, rotated, or is bound to the wrong branch
- Cloudflare build-time content credentials are missing or expired
- the Cloudflare build fails before the Worker is deployed

## Debug Rule

When publication fails, debug this chain in order:

1. the `yt-blog-posts` notify workflow ran
2. `repository_dispatch` started the `yt-blog` redeploy workflow
3. the blog workflow successfully called the Cloudflare Deploy Hook
4. Cloudflare Workers Builds fetched fresh post content
5. the Cloudflare production deployment completed successfully

Do not claim the external app itself is broken unless there is separate
evidence from the blog workflow or Cloudflare build logs.
