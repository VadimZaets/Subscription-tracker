import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont } from '@/utils/uScale';

// TODO(Крок 5): реальна перевірка — чи це перший запуск (AsyncStorage flag).
// Поки що завжди веде на онбординг.
const Splash = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/onboarding/promise');
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.center}>
      <Text style={styles.word}>
        Sn<Text style={styles.accent}>◎</Text>psy
      </Text>
    </View>
  );
};

export default Splash;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
    word: { fontFamily: fontFamilies.extraBold, fontSize: uFont(40), color: colors.text },
    accent: { color: colors.accent2 },
  });
