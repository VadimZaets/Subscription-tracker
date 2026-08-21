import { Ionicons } from '@expo/vector-icons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import TrashIcon from '@/assets/icon/trash.svg';
import { MerchantLogo } from '@/components/MerchantLogo';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { ConfirmSheet } from '@/components/ui/ConfirmSheet';
import { deleteSubscription, getSubscriptionById } from '@/db/queries/subscriptions';
import { openSubscriptionSettings } from '@/lib/appStore';
import { formatCycleAdverb } from '@/lib/format/cycle';
import { formatShortDate, formatWhen } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { strings } from '@/localization/strings';
import { RootStackScreenProps } from '@/navigation/types';
import { findMerchant } from '@/ocr/merchants.catalog';
import { categoryColors, fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

export const SubscriptionDetail = ({
  route,
  navigation,
}: RootStackScreenProps<'SubscriptionDetail'>) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { id } = route.params;
  const { data: rows } = useLiveQuery(getSubscriptionById(id));
  const sub = rows[0];

  const [showCancelCheck, setShowCancelCheck] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  // true між моментом, коли ми вивели людину на сайт скасування, і поверненням
  // у застосунок — лише тоді наступний "стан активний" має відкрити питання.
  const awaitingCancelCheck = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active' && awaitingCancelCheck.current) {
        awaitingCancelCheck.current = false;
        setShowCancelCheck(true);
      }
    });
    return () => subscription.remove();
  }, []);

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCancel = useCallback(() => {
    if (!sub) return;

    // Відомий мерчант з прямим посиланням на керування підпискою (не App
    // Store) — ведемо туди; інакше єдиний чесний варіант — системний екран
    // Apple (сторонній застосунок не може скасувати App Store-підписку сам).
    // sub.cancelUrl (від AI при збереженні) має пріоритет над каталогом.
    const cancelUrl = sub.cancelUrl ?? findMerchant(sub.name)?.cancelUrl;
    awaitingCancelCheck.current = true;

    const open = cancelUrl ? Linking.openURL(cancelUrl) : openSubscriptionSettings();
    Promise.resolve(open).catch(() => {
      if (cancelUrl) openSubscriptionSettings();
    });
  }, [sub]);

  const handleCancelCheckYes = useCallback(() => {
    setShowCancelCheck(false);
    if (sub) deleteSubscription(sub.id).catch(console.error);
  }, [sub]);

  const handleCancelCheckNo = useCallback(() => {
    setShowCancelCheck(false);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    setShowDeleteConfirm(false);
    if (sub) deleteSubscription(sub.id).catch(console.error);
    navigation.goBack();
  }, [sub, navigation]);

  if (!sub) {
    return (
      <Screen padded={false} style={styles.pad}>
        <View style={styles.topbar}>
          <Pressable onPress={handleBack} style={styles.navBtn}>
            <Ionicons name="chevron-back" size={uScale(16)} color={colors.text} />
          </Pressable>
        </View>
        <Text style={styles.notFound}>{strings.subscriptionDetail.notFound}</Text>
      </Screen>
    );
  }

  const merchant = findMerchant(sub.name);
  const categoryColor = merchant?.color ?? categoryColors[sub.category];
  const now = new Date();

  return (
    <Screen padded={false} style={styles.pad} gradientTint={categoryColor}>
      <View style={styles.topbar}>
        <Pressable onPress={handleBack} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={uScale(16)} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => setShowDeleteConfirm(true)} style={styles.navBtn}>
          <TrashIcon width={uScale(16)} height={uScale(16)} color={colors.red} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.identity}>
          <MerchantLogo
            domain={merchant?.domain ?? sub.domain}
            category={sub.category}
            color={categoryColor}
            size={76}
          />
          <Text style={styles.name}>{sub.name}</Text>
          <View style={styles.catTag}>
            <Text style={styles.catTagText}>{strings.categories[sub.category]}</Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.price}>{formatMoney(sub.amount, sub.currency)}</Text>
          <Text style={styles.cycle}>{formatCycleAdverb(sub.cycle)}</Text>
          <View style={styles.priceNextRow}>
            <Ionicons name="calendar-outline" size={uScale(14)} color={colors.textDim} />
            <Text style={styles.priceNextText}>
              {strings.subscriptionDetail.nextChargePrefix}
              <Text style={styles.priceNextBold}>
                {formatShortDate(sub.nextChargeAt)} · {formatWhen(sub.nextChargeAt, now)}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={handleCancel} style={[styles.actBtn, styles.actBtnBad]}>
            <Ionicons name="close" size={uScale(15)} color={colors.red} />
            <Text style={[styles.actLabel, { color: colors.red }]}>
              {strings.subscriptionDetail.cancel}
            </Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>{strings.subscriptionDetail.remindersTitle}</Text>
        <View style={styles.reminderRow}>
          <Text style={styles.reminderText}>{strings.subscriptionDetail.reminderRow}</Text>
          <View style={[styles.toggle, styles.toggleOn]}>
            <View style={styles.toggleKnob} />
          </View>
        </View>
      </ScrollView>

      <ConfirmSheet
        visible={showCancelCheck}
        title={strings.subscriptionDetail.cancelledCheckTitle}
        message={strings.subscriptionDetail.cancelledCheckMessage}
        confirmLabel={strings.subscriptionDetail.cancelledCheckYes}
        cancelLabel={strings.subscriptionDetail.cancelledCheckNo}
        onConfirm={handleCancelCheckYes}
        onCancel={handleCancelCheckNo}
      />

      <ConfirmSheet
        visible={showDeleteConfirm}
        title={strings.subscriptionDetail.deleteConfirmTitle}
        message={strings.subscriptionDetail.deleteConfirmMessage}
        confirmLabel={strings.subscriptionDetail.deleteConfirmYes}
        cancelLabel={strings.subscriptionDetail.deleteConfirmNo}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </Screen>
  );
};

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
    notFound: {
      textAlign: 'center',
      marginTop: uScale(60),
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(14),
      color: colors.textDim,
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
    actLabel: { fontFamily: fontFamilies.bold, fontSize: uFont(13.5), color: colors.text },
    sectionTitle: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(15),
      color: colors.text,
      marginBottom: uScale(13),
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
