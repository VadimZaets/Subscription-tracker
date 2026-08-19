import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

// TODO(Крок 2): реальна форма (мерчант/категорія/сума/цикл) + запис у SQLite.
const AddSubscription = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.title}>{strings.add.title}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label={strings.common.close} onPress={handleClose} />
    </Screen>
  );
};

export default AddSubscription;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26), paddingBottom: uScale(24) },
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(19), color: colors.text },
    spacer: { flex: 1 },
  });
