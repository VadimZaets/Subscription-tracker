import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassCard } from '@/components/GlassCard';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const STEPS = [strings.onboarding.step1, strings.onboarding.step2, strings.onboarding.step3];

const MOCK_ROWS: { name: string; price: string; color: string }[] = [
  { name: 'Netflix', price: '379 ₴/міс', color: '#E44830' },
  { name: 'Spotify', price: '159 ₴/міс', color: '#1DB954' },
  { name: 'iCloud+', price: '75 ₴/міс', color: '#504ECA' },
];

// TODO(Крок 4): реальний expo-image-picker замість кнопки-заглушки.
const OnboardingScan = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleChooseScreenshot = useCallback(() => {
    router.push('/onboarding/result');
  }, []);

  const handleSkip = useCallback(() => {
    router.push('/onboarding/result');
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.stepLabel}>{strings.onboarding.stepLabel}</Text>
      <Text style={styles.title}>{strings.onboarding.scanTitle}</Text>
      <Text style={styles.sub}>{strings.onboarding.scanSub}</Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => (
          <View key={step} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <GlassCard style={styles.mock}>
        <Text style={styles.mockLabel}>{strings.onboarding.exampleLabel}</Text>
        <View style={styles.mockScreen}>
          <Text style={styles.mockTitle}>{strings.onboarding.exampleTitle}</Text>
          {MOCK_ROWS.map((row) => (
            <View key={row.name} style={styles.mockRow}>
              <View style={[styles.mockDot, { backgroundColor: `${row.color}40` }]} />
              <Text style={styles.mockName}>{row.name}</Text>
              <Text style={styles.mockPrice}>{row.price}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      <View style={styles.cta}>
        <PrimaryButton
          label={strings.onboarding.chooseScreenshot}
          onPress={handleChooseScreenshot}
        />
        <Pressable onPress={handleSkip}>
          <Text style={styles.skip}>{strings.onboarding.skip}</Text>
        </Pressable>
      </View>
    </Screen>
  );
};

export default OnboardingScan;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(28), paddingBottom: uScale(24), flex: 1 },
    stepLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(11),
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(10),
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(26),
      color: colors.text,
      marginBottom: uScale(10),
    },
    sub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(15),
      lineHeight: uFont(22),
      color: colors.textDim,
      marginBottom: uScale(24),
    },
    steps: { gap: uScale(15), marginBottom: uScale(24) },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: uScale(13) },
    stepNum: {
      width: uScale(28),
      height: uScale(28),
      borderRadius: uScale(10),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stepNumText: { fontFamily: fontFamilies.bold, fontSize: uFont(13), color: colors.accent2 },
    stepText: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(14),
      color: colors.text,
      paddingTop: uScale(4),
    },
    mock: { flex: 1, padding: uScale(16), minHeight: uScale(150) },
    mockLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(8),
    },
    mockScreen: {
      backgroundColor: colors.glassStrong,
      borderRadius: uScale(12),
      padding: uScale(12),
      gap: uScale(6),
    },
    mockTitle: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13),
      color: colors.text,
      marginBottom: uScale(4),
    },
    mockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(10),
      paddingVertical: uScale(7),
      borderBottomWidth: 1,
      borderBottomColor: colors.borderGlass,
    },
    mockDot: { width: uScale(24), height: uScale(24), borderRadius: uScale(7) },
    mockName: { flex: 1, fontFamily: fontFamilies.medium, fontSize: uFont(12), color: colors.text },
    mockPrice: { fontFamily: fontFamilies.medium, fontSize: uFont(11), color: colors.textDim },
    cta: { marginTop: uScale(18), gap: uScale(10) },
    skip: {
      textAlign: 'center',
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13.5),
      color: colors.textFaint,
    },
  });
