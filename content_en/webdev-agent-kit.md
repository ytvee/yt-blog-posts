---
title: "How I Built WebDev Agent Kit to Stop AI from Rewriting Too Much"
date: "2026-07-26"
description: "How recurring code review problems led me to build my own rule set for frontend agents."
tags: ["AI development", "frontend", "React", "Next.js", "AI agents", "AI news"]
readingTime: 4
ogImage: "https://res.cloudinary.com/dtdrbhksw/image/upload/v1785080056/opt-webdev-agent-kit-cover_htpxdt.webp"
published: true
---

![cover](https://res.cloudinary.com/dtdrbhksw/image/upload/v1785081781/opt-task-scope-monitor_ga47ik.webp)

Development teams at many companies have already shifted to AI-assisted work. We got swept up in that wave too. We write large chunks of code by hand less often now. Most of the time, we design systems, review code, fix bugs, and write small pieces of functionality ourselves when needed.

The same patterns in AI-generated code kept showing up in reviews. They annoyed the hell out of me.

You ask it to fix one thing, and it decides to improve five more at the same time. Or it fixes the right part but breaks something else. It wrote the code quickly, but now the task is back in progress.

I started looking for ready-made skills and agent kits. I wanted to write down the recurring review comments once and add them to a project instead of explaining the same things to the model in every task. I couldn’t find a suitable kit, so I built [WebDev Agent Kit](https://github.com/ytvee-dev/webdev-agent-kit).

**In this article:**

- [Why I looked for a ready-made agent kit](#why-i-looked-for-a-ready-made-agent-kit)
- [Ready-made kits contain too much junk](#ready-made-kits-contain-too-much-junk)
- [I turned code review problems into rules](#i-turned-code-review-problems-into-rules)
- [Then I had to test the rules](#then-i-had-to-test-the-rules)
- [What I ended up with](#what-i-ended-up-with)

<a id="why-i-looked-for-a-ready-made-agent-kit"></a>

## Why I Looked for a Ready-Made Agent Kit

I was looking for rules that governed an agent’s behavior during tasks such as bug fixes. A typical prompt looked like this: “Find this bug and fix it, but don’t refactor anything else. If you need to change related modules, first explain why and ask the user. Don’t install additional libraries without the user’s permission. When you’re done, say which checks you actually ran.”

I was tired of repeating those points in every prompt. I wanted to spend more time describing the task and the architecture, and less time cleaning up the agent’s mess.

<a id="ready-made-kits-contain-too-much-junk"></a>

## Ready-Made Kits Contain Too Much Junk

While searching, I came across repositories stuffed with library documentation, several frameworks, dependencies, and ready-made instructions for every conceivable situation. Most of it had nothing to do with our projects.

Our frontend stack is fairly lightweight. We normally use React or Next.js, a library or framework for state management, and CSS Modules. We add other dependencies to each project as needed.

One project needs a payment system. Another has a Markdown editor. Elsewhere, we use ready-made plugins or frameworks for working with agents. I didn’t want to drag all of that into a shared kit.

The ready-made kits came with someone else’s stack. I wanted the agent to inspect the current project first: which libraries were already installed, how the files were organized, and which commands ran the checks. Only then should it work with what it found.

At some point, building the kit myself became easier than continuing the search.

<a id="i-turned-code-review-problems-into-rules"></a>

## I Turned Code Review Problems into Rules

First, I moved recurring review comments into shared rules. Then I split them by type of work. Fixing a bug, refactoring, reviewing code, reproducing a screenshot in code, and running a visual check all require different behavior from an agent.

[WebDev Agent Kit](https://github.com/ytvee-dev/webdev-agent-kit) now contains 19 skills. I divided them by task type so that, for example, an agent working on a local bug doesn’t read the instructions for building a feature or carrying out a large redesign.

I also classified tasks by scope. Finding a place in the code without changing anything doesn’t need a plan. A local edit stays local. Architecture work, features, and large redesigns do need a plan, because it’s easy to lose part of the requirements or spread changes across the entire project.

I also added a skill that adapts the kit to a project. Before starting work, the agent analyzes the repository, identifies the stack, and creates an updatable cache of commands, structure, and available tools. The other skills use that cache and adapt to the specific project. This helps the agent hallucinate less and produce less AI slop.

I banned the behavior that annoyed me most with a separate rule. The skill limits the agent to the user’s task. It does exactly what it was asked to do. If I ask it to improve a button on one page, the agent changes only that button on that page. This has saved me from AI slop, unnecessary junk in the project, endless README rewrites, and edits to places the agent was never asked to touch.

<a id="then-i-had-to-test-the-rules"></a>

## Then I Had to Test the Rules

At first, WebDev Agent Kit was just a set of instructions. As it grew, one rule could start interfering with another, and the packages for different clients could drift apart. The kit now builds packages for Codex, Claude Code, and Cursor, but they all share the same underlying logic.

I added schemas, validators, and eval scenarios. The schemas define the structure of rule and test files. The validators check required fields, links, and consistency between the skills and packages for Codex, Claude Code, and Cursor. Each eval scenario records a specific request, the route selected for it, and the required and forbidden actions.

For example, a small edit shouldn’t suddenly turn into a major plan that checks the entire repository. If no browser is available, the agent shouldn’t claim it inspected the page. If the user asked for a review, the agent shouldn’t refactor the problems it finds; it should conduct the review and write a report.

The repository now contains 86 such scenarios. They catch and correct cases where a new rule breaks an old one or the instructions for Codex, Claude Code, and Cursor begin to diverge.

<a id="what-i-ended-up-with"></a>

## What I Ended Up With

[WebDev Agent Kit](https://github.com/ytvee-dev/webdev-agent-kit) grew out of our stack and the problems we encountered in code reviews. I don’t claim that it supports every frontend framework.

I ended up with a set of rules that helps agents adapt to different projects. It includes a separate skill for creating new skills and tailoring the kit to a specific project.

Take it, test it, and send feedback. I hope someone finds it useful.
