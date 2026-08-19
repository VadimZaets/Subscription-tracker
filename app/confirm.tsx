import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const PERIOD_OPTIONS = [strings.cycles.weekly, strings.cycles.monthly, strings.cycles.yearly];

// TODO(Крок 4): реальні поля з OCR-пайплайну замість мок-значень.
const Confirm = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [period, setPeriod] = useState<string>(strings.cycles.monthly);

  const handleSave = useCallback(() => {
    router.replace('/(tabs)/home');
  }, []);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Text style={styles.title}>{strings.confirm.title}</Text>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <Ionicons name="close" size={uScale(15)} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.doc}>
          <View style={[styles.docLine, styles.docLineW40]} />
          <View style={[styles.docLine, styles.docLineW65]} />
          <View style={[styles.docLine, styles.docLineW30]} />
          <View style={[styles.docLine, styles.docLineW55]} />
          <View style={[styles.docLine, styles.docLineW45]} />
        </View>
        <Text style={styles.sourceLabel}>{strings.confirm.sourceLabel}, 18 серп 2026</Text>

        <View style={styles.field}>
          <View style={[styles.confDot, { backgroundColor: colors.good }]} />
          <View style={styles.fieldMid}>
            <Text style={styles.fieldLabel}>{strings.confirm.merchantLabel}</Text>
            <Text style={styles.fieldValue}>Netflix</Text>
          </View>
          <Ionicons name="chevron-forward" size={uScale(15)} color={colors.textFaint} />
        </View>

        <View style={styles.field}>
          <View style={[styles.confDot, { backgroundColor: colors.good }]} />
          <View style={styles.fieldMid}>
            <Text style={styles.fieldLabel}>{strings.confirm.amountLabel}</Text>
            <Text style={styles.fieldValue}>379,00 ₴</Text>
          </View>
          <Ionicons name="chevron-forward" size={uScale(15)} color={colors.textFaint} />
        </View>

        <View style={styles.fieldColumn}>
          <View style={styles.fieldColumnTop}>
            <View style={[styles.confDot, { backgroundColor: colors.gold }]} />
            <Text style={styles.fieldLabel}>{strings.confirm.periodLabel}</Text>
            <View style={styles.warnTag}>
              <Text style={styles.warnTagText}>{strings.confirm.periodWarn}</Text>
            </View>
          </View>
          <View style={styles.periodPills}>
            {PERIOD_OPTIONS.map((option) => (
              <Pressable
                key={option}
                onPress={() => setPeriod(option)}
                style={[styles.periodPill, period === option && styles.periodPillOn]}
              >
                <Text style={[styles.periodPillText, period === option && styles.periodPillTextOn]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <View style={[styles.confDot, { backgroundColor: colors.good }]} />
          <View style={styles.fieldMid}>
            <Text style={styles.fieldLabel}>{strings.confirm.nextChargeLabel}</Text>
            <Text style={styles.fieldValue}>21 вересня 2026</Text>
          </View>
          <Ionicons name="chevron-forward" size={uScale(15)} color={colors.textFaint} />
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton label={strings.confirm.save} onPress={handleSave} />
        <Text style={styles.notASubscription}>{strings.confirm.notASubscription}</Text>
      </View>
    </Screen>
  );
};

export default Confirm;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26), flex: 1 },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      marginBottom: uScale(18),
    },
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(19), color: colors.text },
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
    doc: {
      backgroundColor: colors.glassStrong,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(16),
      padding: uScale(16),
      height: uScale(150),
    },
    docLine: {
      height: uScale(9),
      borderRadius: uScale(3),
      backgroundColor: colors.glassStrong,
      marginBottom: uScale(8),
    },
    docLineW40: { width: '40%' },
    docLineW65: { width: '65%' },
    docLineW30: { width: '30%', marginBottom: uScale(20) },
    docLineW55: { width: '55%' },
    docLineW45: { width: '45%' },
    sourceLabel: {
      textAlign: 'center',
      fontFamily: fontFamilies.medium,
      fontSize: uFont(11),
      color: colors.textFaint,
      marginVertical: uScale(10),
    },
    field: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(12),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
      marginBottom: uScale(8),
    },
    confDot: { width: uScale(9), height: uScale(9), borderRadius: uScale(5) },
    fieldMid: { flex: 1 },
    fieldLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10),
      letterSpacing: 0.6,
      textTransform: 'uppercase',
      color: colors.textFaint,
    },
    fieldValue: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(14.5),
      color: colors.text,
      marginTop: uScale(3),
    },
    fieldColumn: {
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
      marginBottom: uScale(8),
      gap: uScale(11),
    },
    fieldColumnTop: { flexDirection: 'row', alignItems: 'center', gap: uScale(12) },
    warnTag: {
      marginLeft: 'auto',
      backgroundColor: `${colors.gold}24`,
      borderRadius: uScale(100),
      paddingHorizontal: uScale(8),
      paddingVertical: uScale(3),
    },
    warnTagText: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(9.5),
      textTransform: 'uppercase',
      color: colors.gold,
    },
    periodPills: { flexDirection: 'row', gap: uScale(8) },
    periodPill: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: uScale(10),
      borderRadius: uScale(11),
      borderWidth: 1,
      borderColor: colors.borderGlass,
    },
    periodPillOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    periodPillText: { fontFamily: fontFamilies.bold, fontSize: uFont(12.5), color: colors.textDim },
    periodPillTextOn: { color: colors.onAccent },
    bottom: {
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingTop: uScale(12),
      paddingBottom: uScale(4),
    },
    notASubscription: {
      textAlign: 'center',
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13),
      color: colors.textFaint,
      marginTop: uScale(13),
    },
  });
