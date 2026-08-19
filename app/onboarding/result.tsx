import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const OnboardingResult = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleContinue = useCallback(() => {
    router.replace('/(tabs)/home');
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.title}>{strings.onboarding.resultTitle}</Text>
      <Text style={styles.sub}>{strings.onboarding.resultSub}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label={strings.onboarding.continue} onPress={handleContinue} />
    </Screen>
  );
};

export default OnboardingResult;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(40), paddingBottom: uScale(24) },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(28),
      color: colors.text,
      marginBottom: uScale(8),
    },
    sub: { fontFamily: fontFamilies.semiBold, fontSize: uFont(14), color: colors.textDim },
    spacer: { flex: 1 },
  });
