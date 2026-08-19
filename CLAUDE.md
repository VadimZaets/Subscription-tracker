@AGENTS.md

## Стиль коду

Правила стилю — `docs/STYLEGUIDE.md`. Читати перед будь-якою правкою в `src/` чи `app/`.

## Git Hooks та Quality Gates

Налаштовано за `docs/SETUP_HOOKS.md`: husky (pre-commit → lint-staged, pre-push →
typecheck + jscpd), commitlint (Conventional Commits), ESLint (flat config,
`eslint.config.mjs`) з sonarjs.

## Claude Code Workflow — Committing

**Do not commit automatically.** After completing a task (new feature, bugfix, refactor):

1. Stage the files (`git add <files>`)
2. At the end of your response, suggest the commit message in this format:

```
$ git commit -m "feat(scope): description"

# or

$ git commit -m "fix(scope): description"
```

The developer will review and run the commit themselves. This lets them:

- Review the staged changes before committing
- Adjust the message if needed
- Maintain control over the git history

**Exception**: Only commit automatically when the user explicitly asks ("commit this" /
"create a commit" / "push to main").
