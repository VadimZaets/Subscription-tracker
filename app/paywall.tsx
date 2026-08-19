import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const FEATURES = [
  strings.paywall.feature1,
  strings.paywall.feature2,
  strings.paywall.feature3,
  strings.paywall.feature4,
];

// TODO(Крок 6): RevenueCat — реальні offerings/purchasePackage() замість статики.
const Paywall = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [plan, setPlan] = useState<'yearly' | 'monthly'>('yearly');

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <Ionicons name="close" size={uScale(15)} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <View style={styles.eyebrow}>
            <Ionicons name="star" size={uScale(11)} color="#fff" />
            <Text style={styles.eyebrowText}>{strings.paywall.eyebrow}</Text>
          </View>
          <Text style={styles.title}>{strings.paywall.title}</Text>
        </View>

        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature} style={styles.featureRow}>
              <View style={styles.featureIcon}>
                <Ionicons name="checkmark" size={uScale(12)} color={colors.good} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        <View style={styles.plans}>
          <Pressable
            onPress={() => setPlan('yearly')}
            style={[styles.plan, plan === 'yearly' && styles.planOn]}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{strings.paywall.yearlyBadge}</Text>
            </View>
            <View style={styles.planLeft}>
              <View style={[styles.radio, plan === 'yearly' && styles.radioOn]}>
                {plan === 'yearly' ? <View style={styles.radioDot} /> : null}
              </View>
              <View>
                <Text style={styles.planName}>{strings.paywall.yearlyName}</Text>
                <Text style={styles.planSub}>{strings.paywall.yearlyPerMonth}</Text>
              </View>
            </View>
            <View style={styles.planRight}>
              <Text style={styles.planPrice}>{strings.paywall.yearlyPrice}</Text>
              <Text style={styles.planPeriod}>{strings.paywall.yearlyPeriod}</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => setPlan('monthly')}
            style={[styles.plan, plan === 'monthly' && styles.planOn]}
          >
            <View style={styles.planLeft}>
              <View style={[styles.radio, plan === 'monthly' && styles.radioOn]}>
                {plan === 'monthly' ? <View style={styles.radioDot} /> : null}
              </View>
              <View>
                <Text style={styles.planName}>{strings.paywall.monthlyName}</Text>
                <Text style={styles.planSub}>{strings.paywall.monthlySub}</Text>
              </View>
            </View>
            <View style={styles.planRight}>
              <Text style={styles.planPrice}>{strings.paywall.monthlyPrice}</Text>
              <Text style={styles.planPeriod}>{strings.paywall.monthlyPeriod}</Text>
            </View>
          </Pressable>
        </View>

        <Text style={styles.lifetimeLink}>
          {strings.paywall.lifetimeLinkPrefix}
          <Text style={styles.lifetimeBold}>{strings.paywall.lifetimePrice}</Text>
        </Text>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton label={strings.paywall.startTrial} onPress={handleClose} />
        <Text style={styles.trialNote}>{strings.paywall.trialNote}</Text>
        <View style={styles.footLinks}>
          <Text style={styles.footLink}>{strings.paywall.restorePurchases}</Text>
          <Text style={styles.footLink}>{strings.paywall.terms}</Text>
          <Text style={styles.footLink}>{strings.paywall.privacy}</Text>
        </View>
      </View>
    </Screen>
  );
};

export default Paywall;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(20), flex: 1 },
    topbar: { alignItems: 'flex-end', paddingHorizontal: uScale(SCREEN_PADDING_H) },
    closeBtn: {
      width: uScale(34),
      height: uScale(34),
      borderRadius: uScale(12),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scroll: { paddingHorizontal: uScale(SCREEN_PADDING_H), paddingBottom: uScale(24) },
    head: { alignItems: 'center', paddingVertical: uScale(8), marginBottom: uScale(22) },
    eyebrow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(6),
      backgroundColor: colors.accent,
      borderRadius: uScale(100),
      paddingHorizontal: uScale(14),
      paddingVertical: uScale(6),
      marginBottom: uScale(16),
    },
    eyebrowText: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(11),
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: colors.onAccent,
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(23),
      color: colors.text,
      textAlign: 'center',
      maxWidth: uScale(260),
    },
    features: { gap: uScale(12), marginBottom: uScale(26) },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: uScale(11) },
    featureIcon: {
      width: uScale(22),
      height: uScale(22),
      borderRadius: uScale(7),
      backgroundColor: `${colors.good}24`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureText: { fontFamily: fontFamilies.semiBold, fontSize: uFont(13.5), color: colors.text },
    plans: { gap: uScale(10), marginBottom: uScale(18) },
    plan: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: uScale(16),
      borderWidth: 1.5,
      borderColor: colors.borderGlass,
      backgroundColor: colors.glass,
      padding: uScale(16),
    },
    planOn: { borderColor: colors.accent, backgroundColor: `${colors.accent}24` },
    badge: {
      position: 'absolute',
      top: uScale(-10),
      left: uScale(16),
      backgroundColor: colors.accent,
      borderRadius: uScale(100),
      paddingHorizontal: uScale(10),
      paddingVertical: uScale(4),
    },
    badgeText: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(9.5),
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: colors.onAccent,
    },
    planLeft: { flexDirection: 'row', alignItems: 'center' },
    radio: {
      width: uScale(20),
      height: uScale(20),
      borderRadius: uScale(10),
      borderWidth: 1.5,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: uScale(12),
    },
    radioOn: { borderColor: colors.accent, backgroundColor: colors.accent },
    radioDot: {
      width: uScale(9),
      height: uScale(9),
      borderRadius: uScale(5),
      backgroundColor: colors.onAccent,
    },
    planName: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.text },
    planSub: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(11.5),
      color: colors.textDim,
      marginTop: uScale(2),
    },
    planRight: { alignItems: 'flex-end' },
    planPrice: { fontFamily: fontFamilies.bold, fontSize: uFont(16), color: colors.text },
    planPeriod: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(10.5),
      color: colors.textFaint,
      marginTop: uScale(2),
    },
    lifetimeLink: {
      textAlign: 'center',
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12.5),
      color: colors.textDim,
    },
    lifetimeBold: { fontFamily: fontFamilies.extraBold, color: colors.text },
    bottom: {
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingTop: uScale(12),
      paddingBottom: uScale(4),
    },
    trialNote: {
      textAlign: 'center',
      fontFamily: fontFamilies.medium,
      fontSize: uFont(12),
      color: colors.textFaint,
      marginTop: uScale(12),
    },
    footLinks: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: uScale(20),
      marginTop: uScale(14),
    },
    footLink: { fontFamily: fontFamilies.bold, fontSize: uFont(11.5), color: colors.textFaint },
  });
