import { Category } from '@/types/category.types';

export type ThemeColors = {
  bg: string;
  text: string;
  textDim: string;
  textFaint: string;
  accent: string;
  accent2: string;
  glass: string;
  glassStrong: string;
  borderGlass: string;
  tabBarBg: string;
  good: string;
  gold: string;
  red: string;
  /** Текст/іконки поверх градієнтного/акцентного фону — не частина dark-палітри як така. */
  onAccent: string;
  onAccentDim: string;
  onAccentGlass: string;
  scrim: string;
  transparent: string;
};

// Поки єдина тема (dark) — весь дизайн-макет побудований під неї.
// Тип готовий під light-варіант, коли/якщо він знадобиться.
export const darkColors: ThemeColors = {
  bg: '#000000',
  text: '#FFFFFF',
  textDim: '#BABCC1',
  textFaint: 'rgba(186,188,193,.55)',
  accent: '#504ECA',
  accent2: '#9B85EE',
  glass: 'rgba(255,255,255,.045)',
  glassStrong: 'rgba(255,255,255,.08)',
  borderGlass: 'rgba(255,255,255,.09)',
  tabBarBg: 'rgba(18,18,24,.92)',
  good: '#3ED598',
  gold: '#DCB85C',
  red: '#FD402C',
  onAccent: '#FFFFFF',
  onAccentDim: 'rgba(255,255,255,.85)',
  onAccentGlass: 'rgba(255,255,255,.18)',
  scrim: 'rgba(0,0,0,.55)',
  transparent: 'transparent',
};

/** Колір категорії за замовчуванням (усі мерчанти тепер ідуть через це, без каталогу). */
export const categoryColors: Record<Category, string> = {
  streaming: '#E44830',
  software: '#504ECA',
  fitness: '#DCB85C',
  games: '#9146FF',
  cloud: '#3ED598',
  other: '#BABCC1',
};
