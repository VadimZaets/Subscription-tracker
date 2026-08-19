import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

// TODO(Крок 3): реальні дані підписки з SQLite за id, історія платежів, нагадування.
const SubscriptionDetail = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen style={styles.pad}>
      <Pressable onPress={handleBack}>
        <Text style={styles.back}>{strings.common.back}</Text>
      </Pressable>
      <Text style={styles.title}>Netflix</Text>
      <Text style={styles.sub}>
        {strings.subscriptionDetail.idPrefix}
        {id}
      </Text>
    </Screen>
  );
};

export default SubscriptionDetail;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26) },
    back: {
      fontFamily: fontFamilies.semiBold,
      color: colors.textDim,
      fontSize: uFont(14),
      marginBottom: uScale(20),
    },
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(23), color: colors.text },
    sub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(13),
      color: colors.textFaint,
      marginTop: uScale(6),
    },
  });
