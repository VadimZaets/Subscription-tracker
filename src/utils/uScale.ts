import { Dimensions, PixelRatio, Platform } from 'react-native';

const BASE_WIDTH = 390;
const TABLET_MIN = 600;

// Android: 'screen', а не 'window' — щоб split-screen і multi-window не
// стискали інтерфейс.
const { width, height } = Dimensions.get(Platform.OS === 'android' ? 'screen' : 'window');

// Коротша сторона: не залежить ні від орієнтації, ні від висоти екрана.
const SHORTEST = Math.min(width, height);
const RATIO = SHORTEST / BASE_WIDTH;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Розмірний клас екрана. Для layout-рішень (колонки, ширина контенту). */
export const isTablet = SHORTEST >= TABLET_MIN;

// Геометрія: помірна поправка поверх flex. RN уже нормалізує щільність (dp),
// тож масштаб тут — не фундамент верстки, а захист від крайніх екранів.
const GEOMETRY_SCALE = clamp(RATIO, 0.9, 1.15);

// Типографіка майже не залежить від екрана: Material, Apple HIG і Restyle
// тримають типографічну шкалу фіксованою, а на великому екрані змінюють layout,
// не кегль. ±6% лишено тільки як захист від крайніх екранів; за читабельність
// відповідає системний масштаб шрифту, який RN накладає сам.
const FONT_SCALE = clamp(RATIO, 0.96, 1.06);

/**
 * Геометрія: відступи, розміри, радіуси, іконки.
 *
 * Системний масштаб шрифту тут не використовується взагалі — інакше
 * налаштування розміру тексту роздувало б усю верстку (див. `uFont`).
 */
export function uScale(px: number): number {
  return PixelRatio.roundToNearestPixel(px * GEOMETRY_SCALE);
}

/**
 * Типографіка: базовий кегль.
 *
 * Свідомо НЕ звертається до `PixelRatio.getFontScale()`: респонсивність
 * (розмір екрана) і font scaling (налаштування користувача) — дві незалежні
 * системи. Системний масштаб React Native накладає сам, поверх цього значення;
 * обмежувати його треба через `maxFontSizeMultiplier` на `<Text>`, а не тут.
 */
export function uFont(px: number): number {
  return PixelRatio.roundToNearestPixel(px * FONT_SCALE);
}
