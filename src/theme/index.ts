// Санкціонований виняток з правила "без barrel-файлів" (STYLEGUIDE §7):
// стабільна публічна точка входу теми, без ризику циклічних імпортів.
export type { ThemeColors } from '@/theme/colors';
export { categoryColors, darkColors } from '@/theme/colors';
export type { FontFamilies } from '@/theme/fonts';
export { fontFamilies } from '@/theme/fonts';
export { useTheme } from '@/theme/useTheme';
