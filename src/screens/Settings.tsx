import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { TAB_BAR_CLEARANCE } from '@/components/tabBar.constants';
import { resetDatabase } from '@/db/queries/reset';
import { strings } from '@/localization/strings';
import { TabScreenProps } from '@/navigation/types';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

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

  const handleOpenPaywall = useCallback(() => {
    navigation.navigate('Paywall');
  }, [navigation]);

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
    { icon: 'cash-outline', title: strings.settings.currency, value: 'UAH ₴' },
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
  });
