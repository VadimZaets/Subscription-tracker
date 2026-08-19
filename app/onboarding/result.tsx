import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryBadge } from '@/components/CategoryBadge';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { mockTimeline } from '@/mocks/subscriptions';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const OnboardingResult = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleContinue = useCallback(() => {
    router.replace('/(tabs)/home');
  }, []);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.header}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={uScale(26)} color={colors.good} />
        </View>
        <Text style={styles.title}>{strings.onboarding.resultTitle}</Text>

        <LinearGradient colors={[colors.accent, colors.accent2]} style={styles.statCard}>
          <Text style={styles.statLabel}>{strings.home.thisMonth}</Text>
          <Text style={styles.statBig}>3 480 ₴</Text>
          <Text style={styles.statSub}>{strings.onboarding.resultSub}</Text>
        </LinearGradient>

        <Text style={styles.listLabel}>{strings.onboarding.foundListLabel}</Text>
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {mockTimeline.map((item) => (
          <View key={item.id} style={styles.item}>
            <CategoryBadge category={item.category} color={item.categoryColor} size={38} />
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemPrice}>{item.price}/міс</Text>
            <View style={styles.itemCheck}>
              <Ionicons name="checkmark" size={uScale(12)} color={colors.good} />
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label={strings.onboarding.continue} onPress={handleContinue} />
        <Text style={styles.note}>{strings.onboarding.continueNote}</Text>
      </View>
    </Screen>
  );
};

export default OnboardingResult;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(36), paddingBottom: uScale(24), flex: 1 },
    header: { paddingHorizontal: uScale(SCREEN_PADDING_H) },
    footer: { paddingHorizontal: uScale(SCREEN_PADDING_H) },
    check: {
      width: uScale(52),
      height: uScale(52),
      borderRadius: uScale(16),
      backgroundColor: `${colors.good}24`,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: uScale(18),
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(26),
      color: colors.text,
      marginBottom: uScale(18),
    },
    statCard: { borderRadius: uScale(18), padding: uScale(18), marginBottom: uScale(20) },
    statLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.onAccentDim,
    },
    statBig: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(32),
      color: colors.onAccent,
      marginTop: uScale(6),
    },
    statSub: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(13),
      color: colors.onAccentDim,
      marginTop: uScale(3),
    },
    listLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(10),
    },
    list: { flex: 1, marginBottom: uScale(16) },
    listContent: { gap: uScale(8), paddingHorizontal: uScale(SCREEN_PADDING_H) },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(10),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(11),
    },
    itemName: { flex: 1, fontFamily: fontFamilies.bold, fontSize: uFont(13.5), color: colors.text },
    itemPrice: { fontFamily: fontFamilies.semiBold, fontSize: uFont(12.5), color: colors.textDim },
    itemCheck: {
      width: uScale(20),
      height: uScale(20),
      borderRadius: uScale(10),
      backgroundColor: `${colors.good}24`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    note: {
      textAlign: 'center',
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12),
      color: colors.textFaint,
      marginTop: uScale(12),
    },
  });
