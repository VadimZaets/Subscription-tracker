import { Ionicons } from '@expo/vector-icons';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { TAB_BAR_CLEARANCE } from '@/components/tabBar.constants';
import { resetDatabase } from '@/db/queries/reset';
import { getDefaultCurrency, setDefaultCurrency } from '@/lib/currency';
import { CURRENCY_CYCLE } from '@/lib/format/money';
import { getRegion, Region, setRegion, SUPPORTED_REGIONS } from '@/lib/region';
import { strings } from '@/localization/strings';
import { TabScreenProps } from '@/navigation/types';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { CurrencyCode } from '@/types/subscription.types';
import { uFont, uScale } from '@/utils/uScale';

const REGION_OPTIONS: Region[] = [...SUPPORTED_REGIONS, 'OTHER'];
const CURRENCY_LABELS: Record<CurrencyCode, string> = { UAH: 'UAH ₴', EUR: 'EUR €', USD: 'USD $' };

type Row = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  sub?: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
};

export const Settings = ({ navigation }: TabScreenProps<'settings'>) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [region, setRegionState] = useState<Region | null>(null);
  const [regionSheetOpen, setRegionSheetOpen] = useState(false);
  const regionSheet = useRef<TrueSheet>(null);
  const [currency, setCurrencyState] = useState<CurrencyCode | null>(null);
  const [currencySheetOpen, setCurrencySheetOpen] = useState(false);
  const currencySheet = useRef<TrueSheet>(null);

  useEffect(() => {
    getRegion().then(setRegionState);
    getDefaultCurrency().then(setCurrencyState);
  }, []);

  useEffect(() => {
    if (regionSheetOpen) {
      regionSheet.current?.present().catch(() => {});
    } else {
      regionSheet.current?.dismiss().catch(() => {});
    }
  }, [regionSheetOpen]);

  useEffect(() => {
    if (currencySheetOpen) {
      currencySheet.current?.present().catch(() => {});
    } else {
      currencySheet.current?.dismiss().catch(() => {});
    }
  }, [currencySheetOpen]);

  const handleOpenPaywall = useCallback(() => {
    navigation.navigate('Paywall');
  }, [navigation]);

  const handleSelectRegion = useCallback((next: Region) => {
    setRegionState(next);
    setRegion(next).catch(console.error);
    setRegionSheetOpen(false);
  }, []);

  const handleSelectCurrency = useCallback((next: CurrencyCode) => {
    setCurrencyState(next);
    setDefaultCurrency(next).catch(console.error);
    setCurrencySheetOpen(false);
  }, []);

  const handleResetData = useCallback(() => {
    Alert.alert(strings.settings.deleteAllConfirmTitle, strings.settings.deleteAllConfirmMessage, [
      { text: strings.common.cancel, style: 'cancel' },
      {
        text: strings.settings.deleteAllConfirmAction,
        style: 'destructive',
        onPress: () => {
          resetDatabase().catch(console.error);
        },
      },
    ]);
  }, []);

  const accountRows: Row[] = [
    {
      icon: 'swap-horizontal-outline',
      title: strings.settings.syncTitle,
      sub: strings.settings.syncSub,
    },
  ];
  const reminderRows: Row[] = [
    { icon: 'notifications-outline', title: strings.settings.reminderCharge },
    { icon: 'trending-up-outline', title: strings.settings.reminderPrice },
    { icon: 'time-outline', title: strings.settings.reminderUnused },
  ];
  const generalRows: Row[] = [
    {
      icon: 'cash-outline',
      title: strings.settings.currency,
      value: currency ? CURRENCY_LABELS[currency] : undefined,
      onPress: () => setCurrencySheetOpen(true),
    },
    {
      icon: 'location-outline',
      title: strings.settings.region,
      value: region ? strings.settings.regionValues[region] : undefined,
      onPress: () => setRegionSheetOpen(true),
    },
    { icon: 'contrast-outline', title: strings.settings.theme, value: strings.settings.themeValue },
    {
      icon: 'globe-outline',
      title: strings.settings.language,
      value: strings.settings.languageValue,
    },
  ];
  const privacyRows: Row[] = [
    { icon: 'arrow-down-circle-outline', title: strings.settings.exportCsv },
    {
      icon: 'shield-checkmark-outline',
      title: strings.settings.privacyPolicy,
      sub: strings.settings.privacyPolicySub,
    },
    {
      icon: 'trash-outline',
      title: strings.settings.deleteAll,
      danger: true,
      onPress: handleResetData,
    },
  ];
  const supportRows: Row[] = [
    { icon: 'help-circle-outline', title: strings.settings.help },
    { icon: 'information-circle-outline', title: strings.settings.about },
  ];

  const renderGroup = (label: string, rows: Row[]) => (
    <View style={styles.groupBlock}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.group}>
        {rows.map((row, index) => (
          <Pressable
            key={row.title}
            onPress={row.onPress}
            disabled={!row.onPress}
            style={[styles.row, index < rows.length - 1 && styles.rowBorder]}
          >
            <View style={[styles.rowIcon, row.danger && styles.rowIconDanger]}>
              <Ionicons
                name={row.icon}
                size={uScale(15)}
                color={row.danger ? colors.red : colors.text}
              />
            </View>
            <View style={styles.rowMid}>
              <Text style={[styles.rowTitle, row.danger && styles.rowTitleDanger]}>
                {row.title}
              </Text>
              {row.sub ? <Text style={styles.rowSub}>{row.sub}</Text> : null}
            </View>
            {row.value ? <Text style={styles.rowValue}>{row.value}</Text> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );

  return (
    <Screen padded={false} edges={TAB_SCREEN_EDGES}>
      <Text style={styles.title}>{strings.settings.title}</Text>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable onPress={handleOpenPaywall}>
          <LinearGradient colors={[colors.accent, colors.accent2]} style={styles.proCard}>
            <View style={styles.proIcon}>
              <Ionicons name="star" size={uScale(18)} color={colors.onAccent} />
            </View>
            <View style={styles.proMid}>
              <Text style={styles.proTitle}>{strings.settings.proTitle}</Text>
              <Text style={styles.proSub}>{strings.settings.proSub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={uScale(16)} color={colors.onAccentDim} />
          </LinearGradient>
        </Pressable>

        {renderGroup(strings.settings.groupAccount, accountRows)}
        {renderGroup(strings.settings.groupReminders, reminderRows)}
        {renderGroup(strings.settings.groupGeneral, generalRows)}
        {renderGroup(strings.settings.groupPrivacy, privacyRows)}
        {renderGroup(strings.settings.groupSupport, supportRows)}

        <Text style={styles.version}>{strings.settings.version}</Text>
      </ScrollView>

      <TrueSheet
        ref={regionSheet}
        detents={['auto']}
        cornerRadius={uScale(24)}
        backgroundColor={colors.bg}
        grabber={false}
        onDidDismiss={() => setRegionSheetOpen(false)}
      >
        <View style={styles.regionSheet}>
          <View style={styles.sheetGrabber} />
          <Text style={styles.regionSheetTitle}>{strings.settings.region}</Text>
          {REGION_OPTIONS.map((option) => (
            <Pressable
              key={option}
              onPress={() => handleSelectRegion(option)}
              style={styles.regionOption}
            >
              <Text style={styles.regionOptionLabel}>{strings.settings.regionValues[option]}</Text>
              {region === option ? (
                <Ionicons name="checkmark" size={uScale(16)} color={colors.accent} />
              ) : null}
            </Pressable>
          ))}
        </View>
      </TrueSheet>

      <TrueSheet
        ref={currencySheet}
        detents={['auto']}
        cornerRadius={uScale(24)}
        backgroundColor={colors.bg}
        grabber={false}
        onDidDismiss={() => setCurrencySheetOpen(false)}
      >
        <View style={styles.regionSheet}>
          <View style={styles.sheetGrabber} />
          <Text style={styles.regionSheetTitle}>{strings.settings.currency}</Text>
          {CURRENCY_CYCLE.map((option) => (
            <Pressable
              key={option}
              onPress={() => handleSelectCurrency(option)}
              style={styles.regionOption}
            >
              <Text style={styles.regionOptionLabel}>{CURRENCY_LABELS[option]}</Text>
              {currency === option ? (
                <Ionicons name="checkmark" size={uScale(16)} color={colors.accent} />
              ) : null}
            </Pressable>
          ))}
        </View>
      </TrueSheet>
    </Screen>
  );
};

const TAB_SCREEN_EDGES = ['top'] as const;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scroll: {
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingBottom: uScale(TAB_BAR_CLEARANCE),
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(26),
      color: colors.text,
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingBottom: uScale(18),
    },
    proCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(14),
      borderRadius: uScale(20),
      padding: uScale(18),
      marginBottom: uScale(24),
    },
    proIcon: {
      width: uScale(44),
      height: uScale(44),
      borderRadius: uScale(14),
      backgroundColor: colors.onAccentGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    proMid: { flex: 1 },
    proTitle: { fontFamily: fontFamilies.extraBold, fontSize: uFont(15), color: colors.onAccent },
    proSub: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12),
      color: colors.onAccentDim,
      marginTop: uScale(2),
    },
    groupBlock: { marginBottom: uScale(24) },
    groupLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(11),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(10),
    },
    group: {
      borderRadius: uScale(18),
      borderWidth: 1,
      borderColor: colors.borderGlass,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(13),
      padding: uScale(14),
      backgroundColor: colors.glass,
    },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.borderGlass },
    rowIcon: {
      width: uScale(32),
      height: uScale(32),
      borderRadius: uScale(10),
      backgroundColor: colors.glassStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rowIconDanger: { backgroundColor: `${colors.red}24` },
    rowMid: { flex: 1 },
    rowTitle: { fontFamily: fontFamilies.bold, fontSize: uFont(14), color: colors.text },
    rowTitleDanger: { color: colors.red },
    rowSub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(11.5),
      color: colors.textFaint,
      marginTop: uScale(2),
    },
    rowValue: { fontFamily: fontFamilies.semiBold, fontSize: uFont(13), color: colors.textDim },
    version: {
      textAlign: 'center',
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(11.5),
      color: colors.textFaint,
    },
    regionSheet: { padding: uScale(20), paddingBottom: uScale(36), alignItems: 'center' },
    sheetGrabber: {
      width: uScale(36),
      height: uScale(4),
      borderRadius: uScale(3),
      backgroundColor: colors.borderGlass,
      marginBottom: uScale(16),
    },
    regionSheetTitle: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(17),
      color: colors.text,
      marginBottom: uScale(12),
    },
    regionOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      alignSelf: 'stretch',
      paddingVertical: uScale(14),
      borderBottomWidth: 1,
      borderBottomColor: colors.borderGlass,
    },
    regionOptionLabel: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(14.5),
      color: colors.text,
    },
  });
