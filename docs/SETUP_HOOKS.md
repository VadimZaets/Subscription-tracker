# Налаштування Git Hooks та Quality Gates для нових проєктів

Цей файл описує як налаштувати тоді ж інструменти при розгортанні BlueBird проєктів.

## Швидкий старт

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional knip jscpd
npx husky init
```

## Крок за кроком

### 1. Встановлення залежностей

```bash
npm install -D \
  husky \
  lint-staged \
  @commitlint/cli \
  @commitlint/config-conventional \
  knip \
  jscpd \
  eslint \
  eslint-plugin-sonarjs \
  prettier
```

**Що це:**

- `husky` — git hooks manager (версійний контроль `.husky/` папки)
- `lint-staged` — запуск лінтерів лише на staged файлах
- `@commitlint/cli` + `@commitlint/config-conventional` — валідація формату комітів
- `knip` — детектор мертвого коду
- `jscpd` — детектор дублювання коду
- `eslint` + `eslint-plugin-sonarjs` — лінтинг, детекція циклічних залежностей та code smells
- `prettier` — форматування кода

### 2. Ініціалізація husky

```bash
npx husky init
```

Це створить `.husky/` папку та добавить `"prepare": "husky"` в `package.json`.

### 3. Налаштування commitlint

Створити `commitlint.config.js` в корені проєкту:

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [1, 'always', 200],
  },
};
```

Додати commit-msg hook:

```bash
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

### 4. Налаштування lint-staged

Створити `lint-staged.config.mjs`:

```js
export default {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
```

Оновити `.husky/pre-commit`:

```bash
echo "npx lint-staged" > .husky/pre-commit
chmod +x .husky/pre-commit
```

### 5. Налаштування pre-push

Оновити `.husky/pre-push` (якщо не існує, створити):

```bash
#!/usr/bin/env sh
npm run typecheck && npm run dup
```

**Nota:** `npm run typecheck` повинна бути в `package.json`:

```json
"scripts": {
  "typecheck": "tsc --noEmit",
  "dup": "jscpd src"
}
```

**Циклічні залежності**: `eslint-plugin-sonarjs` (включена в lint) автоматично детектує циклічні імпорти — додаткового інструменту не потрібно.

Налаштування `.eslintrc.cjs` (або `.eslintrc.js` для CommonJS проєктів):

```js
export default {
  extends: ['eslint:recommended', 'plugin:sonarjs/recommended'],
  plugins: ['sonarjs'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'sonarjs/no-identical-functions': 'error',
    'sonarjs/no-duplicate-string': ['error', { threshold: 5 }],
    'sonarjs/cognitive-complexity': ['error', 15],
    'sonarjs/no-collapsible-if': 'error',
    'sonarjs/no-identical-expressions': 'error',
    'sonarjs/no-redundant-boolean': 'error',
    'sonarjs/prefer-immediate-return': 'error',
    'sonarjs/no-gratuitous-expressions': 'error',
  },
};
```

**SonarJS правила (основні):**

- `no-identical-functions` — функції з однаковим тілом варто об'єднати
- `no-duplicate-string` — строки що повторюються 5+ разів винести в константи
- `cognitive-complexity` — функції не повинні мати занадто складну логіку (max 15)
- `no-collapsible-if` — вкладені if без else можна об'єднати
- `no-identical-expressions` — однакові вирази в умовах або присвоєннях
- `no-redundant-boolean` — зайві boolean повороти (`if (x) return true; return false;`)
- `prefer-immediate-return` — замість присвоєння в змінну, повертати одразу:

  ```js
  // ❌ Не добре
  const result = someFunction();
  return result;

  // ✅ Добре
  return someFunction();
  ```

- `no-gratuitous-expressions` — умови що завжди true/false:

  ```js
  // ❌ Не добре
  if (true) { ... }  // ніколи не буває false
  while (false) { ... }  // мертвий код

  // ✅ Добре
  if (condition) { ... }
  ```

### 6. GitHub PR Template (опціонально)

Створити `.github/pull_request_template.md`:

```markdown
## Що зроблено

-

## Чому

<!-- контекст -->

## Як тестувати

1.

## Тип змін

- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] chore

## Checklist

- [ ] `npm run verify` пройшов
- [ ] Скріншоти / відео (для UI)
```

### 7. Git commit message template (для десктопних клієнтів)

Створити `.gitmessage` в корені:

```
# Формат: <type>(<scope>): <description>
# Типи: feat | fix | refactor | style | chore | docs | build | ci | perf | revert
#
# Приклади:
# feat(auth): add Apple Sign-In
# fix(devices): crash on mDNS timeout
# refactor(shop): extract CartHeaderButton
# chore: update dependencies
#
# Scope — область змін (опціонально)
# Description — імператив, сьогочасний час ("add", не "added")
```

Налаштувати git:

```bash
git config commit.template .gitmessage
```

Всім розробникам нижче додати до їх git config:

```bash
git config commit.template .gitmessage
# або для всіх проєктів:
git config --global commit.template ~/.gitmessage
cp .gitmessage ~/.gitmessage
```

## Валідні типи комітів (Conventional Commits)

| Тип        | Коли                    | Пример                              |
| ---------- | ----------------------- | ----------------------------------- |
| `feat`     | нова фіча               | `feat(auth): add OAuth`             |
| `fix`      | виправлення бага        | `fix(api): null pointer`            |
| `refactor` | рефакторинг             | `refactor(shop): extract component` |
| `style`    | форматування            | `style: run prettier`               |
| `chore`    | конфіги, dev-залежності | `chore: update husky`               |
| `docs`     | документація            | `docs: update README`               |
| `build`    | збірка, prod-залежності | `build: bump app version`           |
| `ci`       | CI/CD конфіги           | `ci: add GitHub Actions`            |
| `perf`     | оптимізація             | `perf: cache device list`           |
| `revert`   | відкат                  | `revert: remove broken feature`     |

## Верифікація налаштування

```bash
# Перевірити commitlint
echo "update stuff" | npx commitlint   # повинна ВПАСТИ
echo "fix(auth): test" | npx commitlint # повинна ПРОЙТИ

# Перевірити git config
git config commit.template   # повинна показати .gitmessage

# Перевірити hooks існують
ls -la .husky/   # повинні бути: commit-msg, pre-commit, pre-push
```

## Для існуючих проєктів (migratiion)

Якщо проєкт вже має commits без Conventional Commits:

```bash
# Не переписуємо історію — просто ввімикаємо для нових комітів
# Husky hooks застосовуватимуться лише до майбутніх комітів
```

Якщо хочеш перевірити останні commits на відповідність:

```bash
npx commitlint --from HEAD~10 --to HEAD --verbose
```

## Моніторинг та дебаг

Якщо hook блокує коміт:

```bash
# Дивись конкретну помилку:
echo "your commit message" | npx commitlint --verbose

# Формат правильний, але hook падає?
# Можеш скипнути на разовий коміт:
git commit --no-verify -m "commit message"
```

## Примітка: Claude Code та коміти

Коли Claude Code інтегрує новий функціонал, виправляє баги або роблять рефакторинг, він може в кінці відповіді запропонувати готовий коміт у форматі:

```bash
$ git commit -m "feat(scope): description"
```

Це — рекомендація формату відповідно до Conventional Commits. Розробник сам запускає команду та переглядає `git diff` перед комітом — таким чином контролює версіонування та історію проєкту.

**Налаштування CLAUDE.md** — щоб Claude завжди писав текст коміту в кінці:

У файлі `CLAUDE.md` додай розділ:

```markdown
## Claude Code Workflow — Committing

**Do not commit automatically.** After completing a task (new feature, bugfix, refactor):

1. Stage the files (`git add <files>`)
2. At the end of your response, suggest the commit message in this format:

\`\`\`
$ git commit -m "feat(scope): description"

# or

$ git commit -m "fix(scope): description"
\`\`\`

The developer will review and run the commit themselves. This lets them:

- Review the staged changes before committing
- Adjust the message if needed
- Maintain control over the git history

**Exception**: Only commit automatically when the user explicitly asks ("commit this" / "create a commit" / "push to main").
```

Це навчить Claude:

- 🚫 **НЕ** комітити автоматично
- ✅ Писати рекомендацію коміту в кінці (у форматі `$ git commit -m "..."`)
- 👤 Залишити контроль розробнику

## Посилання

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [husky docs](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/okonet/lint-staged)
- [commitlint docs](https://commitlint.js.org/)
- [knip docs](https://knip.dev/)
- [jscpd docs](https://github.com/kucherenko/jscpd)
