import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

// TODO(Крок 1): Viewfinder-хедер + TimelineRow з макета замість цього плейсхолдера.
const Home = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleOpenExample = useCallback(() => {
    router.push('/subscription/1');
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.eyebrow}>{strings.home.eyebrow}</Text>
        <Text style={styles.title}>{strings.home.title}</Text>

        <View style={styles.hero}>
          <Text style={styles.heroLbl}>{strings.home.thisMonth}</Text>
          <Text style={styles.heroBig}>3 480 ₴</Text>
        </View>

        <Pressable onPress={handleOpenExample}>
          <Text style={styles.link}>{strings.home.exampleCardLink}</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
};

export default Home;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: { paddingTop: uScale(20), paddingBottom: uScale(140) },
    eyebrow: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(12),
      letterSpacing: 2,
      color: colors.textFaint,
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(22),
      color: colors.text,
      marginTop: uScale(4),
      marginBottom: uScale(24),
    },
    hero: {
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(20),
      padding: uScale(24),
      marginBottom: uScale(24),
    },
    heroLbl: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(11),
      color: colors.textFaint,
      letterSpacing: 1,
    },
    heroBig: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(32),
      color: colors.text,
      marginTop: uScale(8),
    },
    link: { fontFamily: fontFamilies.semiBold, color: colors.accent2, fontSize: uFont(14) },
  });
