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
};
