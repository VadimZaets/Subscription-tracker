import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ApertureIcon } from '@/components/ApertureIcon';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const TRUST_ROWS = [
  strings.onboarding.trust1,
  strings.onboarding.trust2,
  strings.onboarding.trust3,
];

const OnboardingPromise = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleStart = useCallback(() => {
    router.push('/onboarding/scan');
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.eyebrow}>{strings.onboarding.eyebrow}</Text>

      <LinearGradient colors={[colors.accent, colors.accent2]} style={styles.hero}>
        <ApertureIcon size={uScale(42)} color="#fff" />
      </LinearGradient>

      <Text style={styles.title}>
        {strings.onboarding.promiseTitle}
        <Text style={styles.titleAccent}>{strings.onboarding.promiseTitleAccent}</Text>
      </Text>
      <Text style={styles.sub}>{strings.onboarding.promiseSub}</Text>

      <View style={styles.trust}>
        {TRUST_ROWS.map((row) => (
          <View key={row} style={styles.trustRow}>
            <View style={styles.trustIcon}>
              <Ionicons name="checkmark" size={uScale(13)} color={colors.good} />
            </View>
            <Text style={styles.trustText}>{row}</Text>
          </View>
        ))}
      </View>

      <View style={styles.spacer} />
      <PrimaryButton label={strings.onboarding.start} onPress={handleStart} />
      <Text style={styles.link}>{strings.onboarding.haveAccount}</Text>
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
    hero: {
      width: uScale(92),
      height: uScale(92),
      borderRadius: uScale(26),
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: uScale(28),
      marginBottom: uScale(24),
    },
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
    trust: { marginTop: uScale(28), gap: uScale(14) },
    trustRow: { flexDirection: 'row', alignItems: 'center', gap: uScale(12) },
    trustIcon: {
      width: uScale(28),
      height: uScale(28),
      borderRadius: uScale(10),
      backgroundColor: `${colors.good}24`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    trustText: { fontFamily: fontFamilies.semiBold, fontSize: uFont(14), color: colors.textDim },
    link: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13.5),
      color: colors.textFaint,
      textAlign: 'center',
      marginTop: uScale(16),
    },
  });
