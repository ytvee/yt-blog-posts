# build-style-profile

## Purpose

Turn user-provided writing examples into a usable style profile.

## When To Use

- when style examples are available
- before style adaptation work
- when `.agents/project/40-style-profile.md` still contains unresolved `TODO(USER): ...`

## Inputs

- `.agents/data/style-examples-index.md`
- user-provided sample texts or links
- `.agents/project/40-style-profile.md`

## Outputs

- updated style profile with concrete guidance

## Procedure

1. Review the style examples index.
2. Read the actual examples provided by the user.
3. Extract repeatable tone, rhythm, openings, transitions, and vocabulary patterns.
4. Record only observed patterns, not guesses.
5. Update `.agents/project/40-style-profile.md`.

## Must Not

- do not infer style from thin evidence
- do not confuse subject matter with style
- do not remove `TODO(USER): ...` unless the data exists
