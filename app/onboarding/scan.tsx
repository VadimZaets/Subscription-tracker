import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

// TODO(Крок 4): реальний expo-image-picker замість кнопки-заглушки.
const OnboardingScan = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleChooseScreenshot = useCallback(() => {
    router.push('/onboarding/result');
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.title}>{strings.onboarding.scanTitle}</Text>
      <Text style={styles.sub}>{strings.onboarding.scanSub}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label={strings.onboarding.chooseScreenshot} onPress={handleChooseScreenshot} />
    </Screen>
  );
};

export default OnboardingScan;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(40), paddingBottom: uScale(24) },
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
    },
    spacer: { flex: 1 },
  });
