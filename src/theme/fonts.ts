// Ключі RN font family = експортовані назви з @expo-google-fonts/urbanist,
// завантажені в app/_layout.tsx через useFonts().
export const fontFamilies = {
  regular: 'Urbanist_400Regular',
  medium: 'Urbanist_500Medium',
  semiBold: 'Urbanist_600SemiBold',
  bold: 'Urbanist_700Bold',
  extraBold: 'Urbanist_800ExtraBold',
  black: 'Urbanist_900Black',
} as const;

export type FontFamilies = typeof fontFamilies;
