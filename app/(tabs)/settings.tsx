import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const Settings = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleOpenPaywall = useCallback(() => {
    router.push('/paywall');
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{strings.settings.title}</Text>

        <Pressable style={styles.row} onPress={handleOpenPaywall}>
          <Text style={styles.rowTitle}>{strings.settings.goPro}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

export default Settings;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: { paddingTop: uScale(20), paddingBottom: uScale(140) },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(26),
      color: colors.text,
      marginBottom: uScale(24),
    },
    row: {
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(16),
      padding: uScale(16),
    },
    rowTitle: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.text },
  });
