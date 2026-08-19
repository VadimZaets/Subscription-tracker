import { darkColors, ThemeColors } from '@/theme/colors';

// Єдина тема зараз — hook лишається стабільною точкою входу, коли
// з'явиться перемикання light/dark (див. Settings → "Тема").
export function useTheme(): { colors: ThemeColors } {
  return { colors: darkColors };
}
