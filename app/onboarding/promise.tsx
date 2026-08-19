import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const OnboardingPromise = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleStart = useCallback(() => {
    router.push('/onboarding/scan');
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.eyebrow}>{strings.onboarding.eyebrow}</Text>
      <View style={styles.spacerTop} />
      <Text style={styles.title}>
        {strings.onboarding.promiseTitle}
        <Text style={styles.titleAccent}>{strings.onboarding.promiseTitleAccent}</Text>
      </Text>
      <Text style={styles.sub}>{strings.onboarding.promiseSub}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label={strings.onboarding.start} onPress={handleStart} />
    </Screen>
  );
};

export default OnboardingPromise;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(20), paddingBottom: uScale(24) },
    eyebrow: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(12),
      letterSpacing: 3,
      color: colors.textFaint,
    },
    spacerTop: { height: uScale(60) },
    spacer: { flex: 1 },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(34),
      lineHeight: uFont(38),
      color: colors.text,
    },
    titleAccent: { color: colors.accent2 },
    sub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(16),
      lineHeight: uFont(24),
      color: colors.textDim,
      marginTop: uScale(16),
      maxWidth: uScale(300),
    },
  });
