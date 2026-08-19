import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryBadge } from '@/components/CategoryBadge';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const MOCK_PAYMENTS = [
  { date: '21 липня 2026', amount: '379 ₴' },
  { date: '21 червня 2026', amount: '379 ₴' },
  { date: '21 травня 2026', amount: '349 ₴' },
];

// TODO(Крок 3): реальні дані з SQLite за id, дії Скасувати/Пауза пишуть у БД.
const SubscriptionDetail = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Pressable onPress={handleBack} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={uScale(16)} color={colors.text} />
        </Pressable>
        <Pressable style={styles.navBtn}>
          <Ionicons name="pencil-outline" size={uScale(15)} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.identity}>
          <CategoryBadge category="streaming" color="#E44830" size={76} />
          <Text style={styles.name}>Netflix</Text>
          <View style={styles.catTag}>
            <Text style={styles.catTagText}>{strings.categories.streaming}</Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.price}>379 ₴</Text>
          <Text style={styles.cycle}>щомісяця</Text>
          <View style={styles.priceNextRow}>
            <Ionicons name="calendar-outline" size={uScale(14)} color={colors.textDim} />
            <Text style={styles.priceNextText}>
              {strings.subscriptionDetail.nextChargePrefix}
              <Text style={styles.priceNextBold}>24 серпня · через 6 днів</Text>
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <View style={[styles.actBtn, styles.actBtnBad]}>
            <Ionicons name="close" size={uScale(15)} color={colors.red} />
            <Text style={[styles.actLabel, { color: colors.red }]}>
              {strings.subscriptionDetail.cancel}
            </Text>
          </View>
          <View style={[styles.actBtn, styles.actBtnNeutral]}>
            <Ionicons name="pause" size={uScale(15)} color={colors.text} />
            <Text style={styles.actLabel}>{strings.subscriptionDetail.pause}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>{strings.subscriptionDetail.historyTitle}</Text>
        <View style={styles.history}>
          {MOCK_PAYMENTS.map((payment) => (
            <View key={payment.date} style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons name="receipt-outline" size={uScale(14)} color={colors.textDim} />
              </View>
              <Text style={styles.historyDate}>{payment.date}</Text>
              <Text style={styles.historyAmount}>{payment.amount}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{strings.subscriptionDetail.remindersTitle}</Text>
        <View style={styles.reminderRow}>
          <Text style={styles.reminderText}>{strings.subscriptionDetail.reminderRow}</Text>
          <View style={[styles.toggle, styles.toggleOn]}>
            <View style={styles.toggleKnob} />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default SubscriptionDetail;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26), flex: 1 },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: uScale(SCREEN_PADDING_H),
    },
    navBtn: {
      width: uScale(38),
      height: uScale(38),
      borderRadius: uScale(13),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: { paddingHorizontal: uScale(SCREEN_PADDING_H), paddingBottom: uScale(24) },
    identity: { alignItems: 'center', paddingVertical: uScale(20), gap: uScale(4) },
    name: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(23),
      color: colors.text,
      marginTop: uScale(12),
    },
    catTag: {
      marginTop: uScale(8),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(100),
      paddingHorizontal: uScale(10),
      paddingVertical: uScale(4),
    },
    catTagText: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: colors.textDim,
    },
    priceCard: {
      alignItems: 'center',
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(22),
      padding: uScale(22),
      marginBottom: uScale(14),
    },
    price: { fontFamily: fontFamilies.extraBold, fontSize: uFont(36), color: colors.text },
    cycle: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(13),
      color: colors.textDim,
      marginTop: uScale(4),
    },
    priceNextRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(8),
      marginTop: uScale(16),
      paddingTop: uScale(16),
      borderTopWidth: 1,
      borderTopColor: colors.borderGlass,
    },
    priceNextText: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12.5),
      color: colors.textDim,
    },
    priceNextBold: { fontFamily: fontFamilies.extraBold, color: colors.text },
    actions: { flexDirection: 'row', gap: uScale(10), marginBottom: uScale(26) },
    actBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: uScale(7),
      borderRadius: uScale(100),
      paddingVertical: uScale(13),
      borderWidth: 1,
      borderColor: colors.borderGlass,
    },
    actBtnBad: { backgroundColor: `${colors.red}24`, borderColor: colors.transparent },
    actBtnNeutral: { backgroundColor: colors.glass },
    actLabel: { fontFamily: fontFamilies.bold, fontSize: uFont(13.5), color: colors.text },
    sectionTitle: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(15),
      color: colors.text,
      marginBottom: uScale(13),
    },
    history: { gap: uScale(9), marginBottom: uScale(26) },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(12),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(13),
    },
    historyIcon: {
      width: uScale(30),
      height: uScale(30),
      borderRadius: uScale(9),
      backgroundColor: colors.glassStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    historyDate: {
      flex: 1,
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13.5),
      color: colors.text,
    },
    historyAmount: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(13),
      color: colors.textDim,
    },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
    },
    reminderText: {
      flex: 1,
      fontFamily: fontFamilies.medium,
      fontSize: uFont(13.5),
      color: colors.text,
    },
    toggle: {
      width: uScale(40),
      height: uScale(24),
      borderRadius: uScale(12),
      justifyContent: 'center',
    },
    toggleOn: { backgroundColor: colors.accent2 },
    toggleKnob: {
      width: uScale(20),
      height: uScale(20),
      borderRadius: uScale(10),
      backgroundColor: colors.onAccent,
      alignSelf: 'flex-end',
      marginRight: uScale(2),
    },
  });
