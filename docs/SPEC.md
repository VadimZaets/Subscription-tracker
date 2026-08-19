# Snapsy — технічна специфікація (React Native / Expo)

Цей документ — інженерний супутник до продуктового ТЗ і дизайн-макетів (11 екранів у Claude Design). Тут — як саме це кодимо: стек, структура, дані, пайплайн розпізнавання, план побудови по кроках.

Стиль коду й порядок усередині файлів — `docs/STYLEGUIDE.md`. Git hooks і quality gates
(husky/lint-staged/commitlint/ESLint/jscpd) — `docs/SETUP_HOOKS.md`, вже підключені.

Продуктовий контекст коротко: **Snapsy** — трекер підписок без підключення банку. Головний канал наповнення — фото (чек, скріншот системного екрана підписок, форвард листа), а не банківський синк. Повний розбір ринку, болей і конкурентів — в окремому продуктовому ТЗ.

---

## 1. Стек

| Шар            | Вибір                                                                   | Чому                                                                                                 |
| -------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Framework      | **Expo (React Native)**, TypeScript                                     | Один codebase на iOS/Android, швидкий старт для соло-розробки                                        |
| Навігація      | `expo-router` (file-based)                                              | Менше бойлерплейту, маршрути = структура файлів                                                      |
| Стан           | Zustand                                                                 | Легше за Redux, вистачає для локального застосунку без бекенда                                       |
| Локальна БД    | `expo-sqlite` (+ Drizzle ORM)                                           | Офлайн-first, типізовані запити, легка міграція схеми                                                |
| Камера/галерея | `expo-camera`, `expo-image-picker`                                      | Стандартні Expo-модулі, без Custom Dev Client для базового фото                                      |
| OCR            | `expo-config-plugin` + нативний міст на Vision (iOS) / ML Kit (Android) | Expo Go цього не вміє — потрібен **EAS Build / dev client** з першого ж дня, як тільки береться скан |
| Нотифікації    | `expo-notifications` (локальні)                                         | Нагадування плануються на пристрої, без пуш-сервера                                                  |
| Платежі        | RevenueCat (`react-native-purchases`)                                   | StoreKit/Play Billing з коробки, anonymous `app_user_id`                                             |
| Стилі          | `NativeWind` (Tailwind-синтаксис) або `StyleSheet` + токени             | Дизайн-токени з макетів переносяться напряму                                                         |
| Шрифт          | Google Fonts `Urbanist` через `expo-font`                               | Той самий шрифт, що в макетах                                                                        |

**Про `overrides.react-dom` у package.json:** `expo-router` тягне веб-only ланцюжок
`@expo/ui → vaul → @radix-ui/*`, який хоче `react-dom@^19.2.8`, тоді як Expo SDK 57 пінить
`react@19.2.3`. Без оверрайду `npm i` час від часу падає з `ERESOLVE` (нестабільно —
залежить від порядку резолву). Ми не використовуємо web-таргет, тож override просто
змушує react-dom резолвитись у версію, сумісну з нашим react, і робить `npm i`
детермінованим. Якщо колись підключимо `expo start --web` по-справжньому — це перше,
що варто переглянути.

**Важливо:** з моменту, коли додається камера + OCR, **Expo Go більше не підходить** — тільки `expo-dev-client` + EAS Build (безкоштовний tier достатній для соло-розробки). Це рішення приймаємо одразу, щоб не переписувати навігацію й нативні модулі посередині розробки.

---

## 2. Структура проєкту

```
snapsy/
├─ app/                        # expo-router: маршрут = файл
│  ├─ _layout.tsx              # кореневий стек, шрифти, тема
│  ├─ index.tsx                # Splash → редірект на onboarding/home
│  ├─ onboarding/
│  │  ├─ promise.tsx
│  │  ├─ scan.tsx
│  │  └─ result.tsx
│  ├─ (tabs)/
│  │  ├─ _layout.tsx           # таб-бар: Дім · [+ Додати] · Налаштування
│  │  ├─ home.tsx
│  │  └─ settings.tsx
│  ├─ add.tsx                  # ручне додавання
│  ├─ confirm.tsx              # підтвердження після скану
│  ├─ subscription/[id].tsx    # деталі підписки
│  └─ paywall.tsx              # модалка Pro
├─ src/
│  ├─ components/              # Viewfinder, TimelineRow, ReceiptChip, TabBar…
│  ├─ theme/                   # tokens.ts — кольори, типографіка, spacing
│  ├─ db/                      # schema.ts, queries, drizzle migrations
│  ├─ ocr/                     # пайплайн розпізнавання (розділ 5)
│  ├─ store/                   # zustand-стори
│  └─ lib/                     # дати, валюти, форматування
├─ assets/fonts/, assets/icons/
├─ docs/SPEC.md                # цей файл
└─ app.json / eas.json
```

---

## 3. Дизайн-токени

Переносимо напряму з макетів (`src/theme/tokens.ts`):

```ts
export const colors = {
  bg: '#000000',
  text: '#FFFFFF',
  textDim: '#BABCC1',
  textFaint: 'rgba(186,188,193,.55)',
  accent: '#504ECA',
  accent2: '#9B85EE',
  glass: 'rgba(255,255,255,.045)',
  borderGlass: 'rgba(255,255,255,.09)',
  good: '#3ED598',
  gold: '#DCB85C',
  red: '#FD402C',
};

export const gradientAccent = ['#504ECA', '#9B85EE']; // expo-linear-gradient
export const font = { family: 'Urbanist', mono: 'IBMPlexMono' };
```

Компоненти-примітиви, яких немає в жодному UI-кіті (треба зверстати самим, вже спроєктовані в макетах):

- **Viewfinder** — рамка з чотирма L-кутами навколо суми на Home
- **TimelineRow** — вузол на осі + картка списання
- **ReceiptChip** — картка з пунктирною лінією «відриву» + бейдж-камера
- **CategoryBadge** — контурне коло (16%-заливка + 45%-рамка кольору категорії) з іконкою замість кольорового кружка з літерою
- **TabBar** — 3 таби, центральна кнопка «Додати» піднята над лінією бару

---

## 4. Модель даних (SQLite / Drizzle)

```ts
// src/db/schema.ts
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // streaming|software|fitness|games|cloud|other
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  billingCycle: text('billing_cycle').notNull(), // weekly|monthly|yearly|custom
  cycleDays: integer('cycle_days'),
  firstChargeAt: text('first_charge_at').notNull(),
  nextChargeAt: text('next_charge_at').notNull(),
  status: text('status').notNull(), // active|trial|paused|cancelled
  trialEndsAt: text('trial_ends_at'),
  source: text('source').notNull(), // photo|screenshot|email|manual
  confidence: real('confidence'),
  createdAt: text('created_at').notNull(),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  subscriptionId: text('subscription_id').references(() => subscriptions.id),
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  chargedAt: text('charged_at').notNull(),
  fxRate: real('fx_rate'),
  isPriceChange: integer('is_price_change', { mode: 'boolean' }),
});

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // receipt|store_screenshot|email
  localUri: text('local_uri').notNull(),
  ocrText: text('ocr_text'),
  parsedJson: text('parsed_json'), // JSON blob
  status: text('status').notNull(), // pending|confirmed|rejected
  capturedAt: text('captured_at').notNull(),
});
```

Повна логіка (чому Subscription/Payment окремо, чому валюта фіксується на дату) — у продуктовому ТЗ, розділ 08.

---

## 5. Пайплайн розпізнавання (спрощено під MVP)

Для v1 у RN/Expo — без розділення на «рівень A / рівень B» одразу. Простіший шлях:

1. **Захоплення** — `expo-camera` або `expo-image-picker` → локальний URI.
2. **OCR на пристрої** — нативний міст:
   - iOS: `VNRecognizeTextRequest` через невеликий Swift-модуль (`expo-modules-api`)
   - Android: ML Kit Text Recognition v2 через Kotlin-модуль
   - Готові community-обгортки (`@react-native-ml-kit/text-recognition`, або власний `expo-config-plugin`) — оцінити на старті кодингу, не писати з нуля, якщо є придатний пакет.
3. **Парсинг тексту → поля** — спершу прості regex/евристики (сума, дата, ключові слова "Netflix", "Spotify" зі словника топ-50 сервісів) в `src/ocr/parse.ts`. LLM-рівень (Claude API) — фаза 2, коли з'явиться бекенд.
4. **Екран підтвердження** — завжди, з підсвіченими полями та рівнем впевненості (макет `confirm.tsx` вже готовий).

---

## 6. Фазований план побудови

Кодимо екран за екраном, у порядку, що дає видимий результат найшвидше:

**Крок 0 — каркас**

- `npx create-expo-app` з TypeScript-темплейтом, `expo-router`, NativeWind
- Підключити шрифт Urbanist, токени теми, кореневий `_layout.tsx`
- Порожній таб-бар (Дім / Додати / Налаштування) — статичний, без даних

**Крок 1 — Home на моках**

- `TimelineRow`, `Viewfinder`, дані з локального моку (не з БД ще)
- Мета: екран Home виглядає й скролиться так само, як у Claude Design макеті

**Крок 2 — SQLite + ручне додавання**

- Схема Drizzle, `add.tsx` пише в БД
- Home читає з БД замість моку

**Крок 3 — Деталі підписки, пауза/скасування-інструкція, нагадування**

- `subscription/[id].tsx`, `expo-notifications` для локальних нагадувань

**Крок 4 — Камера + OCR (тут переходимо на EAS dev client)**

- `expo-camera`/`expo-image-picker`, нативний OCR-міст, `confirm.tsx` реально показує розпізнані поля

**Крок 5 — Онбординг**

- `promise.tsx` → `scan.tsx` → `result.tsx`, парсер скріншота системного екрана підписок (шаблонний, без LLM)

**Крок 6 — Paywall + RevenueCat**

- Free/Pro/Lifetime ліміти, 7-денний тріал

Кожен крок — окремий робочий стан застосунку, який можна запустити й показати. Починаємо з Кроку 0.

---

## 7. Що навмисно поза MVP

- Підключення банку / open banking — ніколи (це ядро позиціонування)
- Синхронізація між пристроями — окремий шар пізніше, опційний, без обов'язкової реєстрації
- LLM-парсинг — фаза 2, коли є бекенд і сенс платити за інференс
- Android-специфічні фічі (читання сповіщень) — після того, як iOS-версія стабільна
