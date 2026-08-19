import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ApertureIcon } from '@/components/ApertureIcon';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

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
    <LinearGradient colors={['#0B1220', '#0A0E1A', '#05070D']} style={styles.gradient}>
      <View style={styles.center}>
        <View style={styles.wordRow}>
          <Text style={styles.word}>Sn</Text>
          <View style={styles.glyph}>
            <ApertureIcon size={uScale(34)} color={colors.text} />
          </View>
          <Text style={styles.word}>psy</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Splash;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    gradient: { flex: 1 },
    center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    wordRow: { flexDirection: 'row', alignItems: 'center' },
    word: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(44),
      color: colors.text,
    },
    glyph: { marginHorizontal: uScale(2), transform: [{ translateY: uScale(3) }] },
  });
