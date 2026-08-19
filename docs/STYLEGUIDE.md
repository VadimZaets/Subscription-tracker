# STYLEGUIDE — єдиний стиль коду (Chujka App)

Цей документ — джерело правди для стилю. Частину правил примусово тримає ESLint
(див. `.eslintrc.cjs`); решта — домовленість, яку перевіряємо на код-ревʼю.

> Статус: правила стилю спершу увімкнені як `warn`, щоб не блокувати міграцію.
> Наприкінці рефакторингу піднімаємо до `error`.

---

## 1. Оголошення компонента

`const`-стрілка з типом на параметрі, **named export**. Без `React.FC`, без `default export`.

```tsx
// ✅ так
export const TextInput = (props: TextInputProps) => { … };

// ❌ ні
export const TextInput: React.FC<TextInputProps> = (props) => { … }; // зайвий React.FC
export function TextInput(props: TextInputProps) { … }               // інша форма
export default function TextInput(props) { … }                       // default export
```

Enforced: `react/function-component-definition` (arrow-function), `import/no-default-export`
(у `src/components`, `src/screens`).

## 2. Оголошення функцій: `function` vs `const`

Форму диктує **область видимості**, не смак. Мнемонік:
**експортуєш із модуля — `function`; передаєш/присвоюєш усередині — `const`-стрілка.**

**`function`-декларація — для іменованих функцій рівня модуля:** утиліти, сервіси,
фабрики, хуки. Гойстинг дозволяє тримати «головне зверху, дрібні хелпери нижче»,
а ім'я видно у стек-трейсі.

```ts
// ✅ утиліта / сервіс (camelCase.ts)
export function extractText(node: DomNode): string { … }
export function createImageCache(dir: string, mode: StoredPathMode): ImageCache { … }

// ✅ хук
export function usePullToRefresh(onRefresh: () => Promise<void>) { … }
```

**`const`-стрілка — для React-компонентів і для всього, що живе _всередині_ файлу
компонента:** обробники `handleX`, render-хелпери `renderX`, локальні фабрики
(`makeStyles`). Так файл компонента має одну форму зверху донизу (див. §1, §11).

```tsx
export const Screen = (props: ScreenProps) => {   // компонент — стрілка (§1)
  const handlePress = () => { … };                // локальний обробник — стрілка
  const renderItem = ({ item }) => <Row … />;     // render-хелпер — стрілка
  return ( … );
};

const makeStyles = (colors: ThemeColors) =>       // локальна фабрика — стрілка
  StyleSheet.create({ … });
```

| Що                                                       | Форма                      |
| -------------------------------------------------------- | -------------------------- |
| Компонент (PascalCase)                                   | `const`-стрілка (enforced) |
| Хук `useX`                                               | `function`                 |
| Утиліта / сервіс / фабрика рівня модуля (camelCase)      | `function`                 |
| Обробник / `renderX` / `makeStyles` всередині компонента | `const`-стрілка            |

> Чому `function` на рівні модуля: гойстинг (порядок оголошень не важливий), іменований
> у стек-трейсі, візуально відділяє «публічний API модуля» від локальних замикань.
> Чому стрілка для колбеків: колбек — це _значення_, яке передають (у проп, `.map`,
> `useCallback`), а значення природно писати виразом; плюс стрілка лексично замикає
> скоуп без сюрпризів із `this`.
> Хук — не колбек, а функція, яку модуль експортує, тож `function` (міф про `this` до
> хуків не застосовний — там `this` не існує). Компонент — виняток за eslint-конвенцією.
>
> ⚠️ `function` — лише для **самої декларації** хука. Усередині хука діє те саме правило,
> що й у компоненті (§1, §11): внутрішні обробники, асинхронні запити та render-хелпери —
> `const`-стрілки, а не `function`. Мемоізуємо їх (`useCallback`) **не за замовчуванням, а за
> §3** — коли посилання йде в memo-проп, deps, ref чи слухач. І `function`, і `const`-стрілка
> всередині хука перестворюються щовиклику однаково — вибір форми тут про стиль (одна форма
> зверху донизу), а стабільність посилання дає лише `useCallback`, не форма декларації.

Enforced (частково): `react/function-component-definition` (arrow) — лише для компонентів.
Форму хелперів ESLint не диктує — домовленість код-ревʼю.

## 3. Мемоізація: `useCallback` / `useMemo` / `memo`

Правило: мемоізуємо **не «про всяк випадок», а коли ідентичність/обчислення реально
комусь потрібні**. Зайвий `useCallback`/`useMemo` — це шум і хибне відчуття оптимізації;
пропущений там, де треба, — зайві ререндери або нескінченні цикли.

### `useCallback` — коли ТАК

Стабілізуємо посилання функції, якщо вона:

1. передається у **memo-компонент** (`React.memo`) пропом;
2. є **залежністю** `useEffect` / `useMemo` / іншого `useCallback` (інакше ефект
   перезапускається щорендер → нескінченні цикли);
3. кладеться в `ref` або повертається з хука як стабільний API;
4. реєструє/знімає слухача (`addEventListener`, підписки) — потрібне те саме посилання.

### `useCallback` — коли НЕ треба

- Інлайн-обробник у **звичайний** (не-memo) елемент: `<Button onPress={() => …} />`.
  Нове посилання щорендер тут нічого не коштує — RN-примітиви пропси не порівнюють.
- Функція викликається лише всередині компонента і нікуди не передається.

> Обгортати все підряд — анти-патерн: додає шум і ховає справді гарячі місця.

### `useMemo` — коли ТАК

1. **Дороге обчислення**: фільтр/сорт/трансформація великого масиву, побудова `Map`.
2. Значення — **залежність** іншого хука або проп у memo-компонент.
3. `makeStyles(colors)` — канонічний випадок (`useMemo(() => makeStyles(colors), [colors])`).

> Для примітивів (`const x = a + b`) `useMemo` зайвий — обчислення дешевше за мемоізацію.

### `React.memo` — коли ТАК

- Компонент часто ререндериться від батька, а його **власні пропси майже не міняються**
  (типово — рядок списку).
- ⚠️ **Умова, без якої `memo` марний:** усі функції/об'єкти-пропси мають бути
  **стабільними** (`useCallback`/`useMemo`). Інакше memo щоразу бачить нові посилання і
  **ніколи не пропускає ререндер** — платиш за memo, користі нуль.

```tsx
// ❌ memo марний: onPress — нова стрілка щорендер
const Row = React.memo(RowInner);
<Row item={item} onPress={() => open(item)} />;

// ✅ memo працює: стабільний обробник, який приймає id
const handlePress = useCallback((it: Item) => open(it), [open]);
<Row item={item} onPress={handlePress} />; // Row усередині кличе onPress(item)
```

### Залежності — головне

Будь-який `useCallback`/`useMemo`/`useEffect`: **усе реактивне, що читаєш усередині, — у
масив залежностей**. Пропущена залежність = stale-замикання (старі дані); зайва = зайві
перерахунки. `[]` коректний лише коли всередині немає реактивних значень із рендер-скоупу
(лише сеттери стану та модульні константи).

Enforced: `react-hooks/exhaustive-deps` (перевіряє масив залежностей). Рішення «чи взагалі
мемоізувати» ESLint не диктує — домовленість код-ревʼю за правилами вище.

## 4. Пропси

Через `type`, не `interface`. Ім'я — `<Component>Props`.

```tsx
// ✅
type TextInputProps = { value: string; onChangeText: (t: string) => void };

// ❌
interface TextInputProps { … }
```

Enforced: `@typescript-eslint/consistent-type-definitions: 'type'`.

## 5. Стилі та кольори

Єдиний патерн — `makeStyles(colors)` + `useMemo`. **Усі кольори з теми** (`useTheme()`),
жодних hex-літералів і жодних inline-стилів у JSX.

```tsx
export const TextInput = (props: TextInputProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  return <View style={styles.container}>…</View>;
};

// Хелпери — теж const-стрілка (одне правило для всього файлу).
const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: { borderColor: colors.border },
    error: { color: colors.danger }, // ❌ було '#E53935'
  });
```

- Розміри — через `uScale()` (`@/utils/uScale`), шрифти — `fontFamilies` (`@/theme/fonts`).
- Немає потрібного кольору в темі → **додати в `@/theme/colors.ts`**, не хардкодити.

Enforced: `react-native/no-color-literals`, `react-native/no-inline-styles`.
(`no-unused-styles` вимкнено — не розуміє динамічний `makeStyles`.)

## 6. Іменування хендлерів

Внутрішні обробники — `handleX`; пропси-колбеки — `onX`.

```tsx
type FormProps = { onSubmit: () => void };
const Form = ({ onSubmit }: FormProps) => {
  const handlePress = () => onSubmit();
  return <Button onPress={handlePress} />;
};
```

## 7. Іменування файлів і папок

- Компонент: `PascalCase.tsx`, 1 компонент = 1 файл, ім'я файлу = ім'я компонента.
- Хук: `useX.ts`. Інші модулі: `camelCase.ts`. Типи: `x.types.ts`.
- **Без barrel-файлів** (`index.ts`): імпортуємо напряму (`@/features/games/components/Leaderboard`).
  Менше файлів, нуль ризику циклічних імпортів і кращий tree-shaking у Metro.
  - Єдиний санкціонований виняток — `@/theme` (`src/theme/index.ts`): стабільний leaf без
    ризику циклів, публічна точка теми. Нові barrel-и не додаємо.
- Файл-компонент не називаємо `index.tsx` — навіть у власній теці компонента ім'я файлу =
  ім'я компонента (`DeviceInfoTab/DeviceInfoTab.tsx`, не `DeviceInfoTab/index.tsx`).

## 8. Імпорти

- Абсолютні через аліас `@/*` (= `src/*`). Уникати `../../../`.
- Порядок сортує `simple-import-sort` (auto-fix).

```tsx
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemeColors, useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';
```

Enforced: `simple-import-sort/imports`, `import/no-duplicates`, `import/no-cycle`.

## 9. Рядки (i18n)

Жодного укр. тексту інлайн у JSX — усі рядки з `@/localization/strings`.

```tsx
import { strings } from '@/localization/strings';
<Text>{strings.devices.title}</Text>; // ❌ було <Text>Пристрої</Text>
```

## 10. Розмір файлу

Компонент > ~300 рядків — сигнал розбити (виділити підкомпоненти/хуки).

## 11. Порядок усередині файлу

Завжди однаковий, зверху вниз — щоб знати, де що шукати:

1. **Імпорти** (сортує `simple-import-sort`).
2. **Константи модуля** та **`type XProps`** (поза компонентом).
3. **Компонент** (const-стрілка) — усередині суворий порядок:
   1. `useTheme()` + одразу `const styles = useMemo(() => makeStyles(colors), [colors])`;
   2. інші хуки-контексти/бібліотеки: `useNavigation`, `useRoute`, `useSafeAreaInsets`, custom-хуки;
   3. `useState`;
   4. `useRef`;
   5. похідні `useMemo` / обчислені значення;
   6. `useEffect`;
   7. обробники `handleX` (та `useCallback`);
   8. render-хелпери `renderX`;
   9. **guard / early return** (`if (loading) return <Skeleton />`);
   10. основний `return ( … )`.
4. **`makeStyles`** — у кінці файлу.

```tsx
export const Screen = (props: ScreenProps) => {
  const { colors } = useTheme();                 // 1
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const insets = useSafeAreaInsets();            // 2
  const [items, setItems] = useState([]);        // 3
  const listRef = useRef(null);                  // 4
  const total = useMemo(() => items.length, [items]); // 5
  useEffect(() => { load(); }, [load]);          // 6
  const handlePress = () => { … };               // 7
  const renderItem = ({ item }) => <Row item={item} />; // 8
  if (!items.length) return <Empty />;           // 9
  return ( … );                                  // 10
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({ … });
```

> `handleX` vs `renderX`: `handle*` — реакція на подію; `render*` — повертає JSX-фрагмент.
> Порядок хуків — домовленість (перевіряємо на код-ревʼю; ESLint форму хуків не диктує).

## 12. Енами замість magic strings (обовʼязково)

Будь-який фіксований набір рядкових значень — вкладки, статуси, режими, типи подій,
екрани — оголошуємо `enum`, а не порівнюємо/передаємо «сирі» рядки.

```tsx
// ❌ magic string
{
  tab === 'games' && <AppBackground />;
}
setView('cup');

// ✅ enum
enum GamesTab {
  Games = 'games',
  Achievements = 'cup',
}
{
  tab === GamesTab.Games && <AppBackground />;
}
setView(GamesTab.Achievements);
```

- Прецедент у проєкті: `RootStackScreens` (`@/types/navigation/root`) — навігацію вже адресуємо
  через enum (`RootStackScreens.Game`), не рядком `'Game'`. Так само для решти категорій.
- Enum кладемо поряд із фічею (`features/<f>/…`) або в `@/types`, якщо спільний.
- Це домовленість код-ревʼю (ESLint усі magic strings не ловить); нові категорії — одразу enum.

---

## Приклад «до → після» (`ui/forms/TextInput.tsx`)

| Було                                                            | Стало                                                 |
| --------------------------------------------------------------- | ----------------------------------------------------- |
| `export const TextInput: React.FC<TextInputProps> = (props) =>` | `export const TextInput = (props: TextInputProps) =>` |
| `interface TextInputProps`                                      | `type TextInputProps`                                 |
| `import { useTheme } from '../../../theme'`                     | `import { useTheme } from '@/theme'`                  |
| `borderColor: '#E53935'`                                        | `borderColor: colors.danger`                          |
| `const makeStyles = (colors) =>` (лишається)                    | `const makeStyles = (colors: ThemeColors) =>`         |

## Структура (ціль)

- `src/components/` — лише **спільні, feature-agnostic** примітиви (`ui/`, `layout/`).
- `src/features/<feature>/` — усе, що належить конкретній фічі (`components/`, `hooks/`).
- Правило «куди класти»: використовується в ≥2 фічах → `components/`; інакше → у свою фічу.
