# Redeploy Workflow

This repository can trigger a redeploy of the external blog project through a Vercel Deploy Hook.

## Purpose

- a new or updated post is pushed here
- GitHub Actions calls the deploy hook
- the external Vercel project starts a new deployment

This repository does not build or validate the external app runtime.

## Workflow File

- `.github/workflows/redeploy-blog.yml`

## Trigger Contract

- trigger on `push` to `main`
- allow manual runs through `workflow_dispatch`
- prevent overlapping redeploy jobs through workflow concurrency

## Secret Contract

Required GitHub Actions secret:

- `VERCEL_DEPLOY_HOOK_URL`

Important:

- this is a GitHub repository secret, not a Vercel environment variable
- the value should be the full Deploy Hook URL created in the external Vercel project

## Common Failure Modes

- the workflow file was changed locally but not pushed to `main`
- the secret was created in the wrong place
- an old workflow still depends on `environment: env`
- GitHub Actions is disabled in the repository
- the secret name does not exactly match `VERCEL_DEPLOY_HOOK_URL`

## Debug Rule

When redeploy fails, debug the GitHub workflow trigger contract first. Do not claim the external app itself is broken unless there is separate evidence.
