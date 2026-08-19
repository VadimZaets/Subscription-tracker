import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

// TODO(Крок 6): RevenueCat — реальні плани (річний/місячний/lifetime), 7-денний тріал.
const Paywall = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.eyebrow}>{strings.paywall.eyebrow}</Text>
      <Text style={styles.title}>{strings.paywall.title}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label={strings.paywall.startTrial} onPress={handleClose} />
    </Screen>
  );
};

export default Paywall;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26), paddingBottom: uScale(24) },
    eyebrow: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(11),
      letterSpacing: 1.5,
      color: colors.text,
      backgroundColor: colors.accent,
      alignSelf: 'flex-start',
      paddingHorizontal: uScale(12),
      paddingVertical: uScale(5),
      borderRadius: uScale(100),
      overflow: 'hidden',
      marginBottom: uScale(14),
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(24),
      color: colors.text,
      maxWidth: uScale(280),
    },
    spacer: { flex: 1 },
  });
