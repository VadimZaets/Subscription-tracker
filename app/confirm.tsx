import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

// TODO(Крок 4): реальні розпізнані поля з OCR-пайплайну + рівень впевненості.
const Confirm = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleSave = useCallback(() => {
    router.replace('/(tabs)/home');
  }, []);

  return (
    <Screen style={styles.pad}>
      <Text style={styles.title}>{strings.confirm.title}</Text>
      <View style={styles.spacer} />
      <PrimaryButton label={strings.confirm.save} onPress={handleSave} />
    </Screen>
  );
};

export default Confirm;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26), paddingBottom: uScale(24) },
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(19), color: colors.text },
    spacer: { flex: 1 },
  });
