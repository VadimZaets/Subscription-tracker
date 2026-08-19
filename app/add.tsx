import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { Category } from '@/types/category.types';
import { uFont, uScale } from '@/utils/uScale';

const CATEGORY_ORDER: Category[] = ['streaming', 'software', 'fitness', 'games', 'cloud', 'other'];
const CYCLE_OPTIONS: { key: 'weekly' | 'monthly' | 'yearly' | 'once'; label: string }[] = [
  { key: 'weekly', label: strings.cycles.weekly },
  { key: 'monthly', label: strings.cycles.monthly },
  { key: 'yearly', label: strings.cycles.yearly },
  { key: 'once', label: strings.cycles.once },
];

// TODO(Крок 2): createSubscription() у SQLite замість router.back() без збереження.
const AddSubscription = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [category, setCategory] = useState<Category>('streaming');
  const [cycle, setCycle] = useState<(typeof CYCLE_OPTIONS)[number]['key']>('monthly');
  const [reminderOn, setReminderOn] = useState(true);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleScanInstead = useCallback(() => {
    router.replace('/onboarding/scan');
  }, []);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <Ionicons name="close" size={uScale(15)} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{strings.add.title}</Text>
        <View style={styles.closeBtnSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={handleScanInstead} style={styles.scanCta}>
          <View style={styles.scanIcon}>
            <Ionicons name="camera" size={uScale(17)} color="#fff" />
          </View>
          <View style={styles.scanMid}>
            <Text style={styles.scanTitle}>{strings.add.scanCtaTitle}</Text>
            <Text style={styles.scanSub}>{strings.add.scanCtaSub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={uScale(15)} color={colors.textDim} />
        </Pressable>

        <Text style={styles.fieldLabel}>{strings.add.merchantLabel}</Text>
        <TextInput
          placeholder="Netflix"
          placeholderTextColor={colors.textFaint}
          style={styles.input}
        />

        <Text style={styles.fieldLabel}>{strings.add.categoryLabel}</Text>
        <View style={styles.chips}>
          {CATEGORY_ORDER.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.chip, category === cat && styles.chipOn]}
            >
              <Text style={[styles.chipText, category === cat && styles.chipTextOn]}>
                {strings.categories[cat]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>{strings.add.amountLabel}</Text>
        <View style={styles.amountRow}>
          <TextInput
            placeholder="0,00"
            placeholderTextColor={colors.textFaint}
            keyboardType="decimal-pad"
            style={styles.amountInput}
          />
          <View style={styles.currencyPick}>
            <Text style={styles.currencyText}>₴</Text>
            <Ionicons name="chevron-down" size={uScale(11)} color={colors.textDim} />
          </View>
        </View>

        <Text style={styles.fieldLabel}>{strings.add.cycleLabel}</Text>
        <View style={styles.cyclePills}>
          {CYCLE_OPTIONS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => setCycle(option.key)}
              style={[styles.pill, cycle === option.key && styles.pillOn]}
            >
              <Text style={[styles.pillText, cycle === option.key && styles.pillTextOn]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.fieldLabel}>{strings.add.firstChargeLabel}</Text>
        <View style={styles.dateField}>
          <Ionicons name="calendar-outline" size={uScale(16)} color={colors.textDim} />
          <Text style={styles.dateText}>21 серпня 2026</Text>
        </View>

        <Pressable onPress={() => setReminderOn((v) => !v)} style={styles.reminderRow}>
          <View style={styles.reminderMid}>
            <Text style={styles.reminderTitle}>{strings.add.reminderTitle}</Text>
            <Text style={styles.reminderSub}>{strings.add.reminderSub}</Text>
          </View>
          <View style={[styles.toggle, reminderOn ? styles.toggleOn : styles.toggleOff]}>
            <View
              style={[styles.toggleKnob, reminderOn ? styles.toggleKnobOn : styles.toggleKnobOff]}
            />
          </View>
        </Pressable>
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton label={strings.add.submit} onPress={handleClose} />
      </View>
    </Screen>
  );
};

export default AddSubscription;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(20), flex: 1 },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      marginBottom: uScale(18),
    },
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
    closeBtnSpacer: { width: uScale(34) },
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(19), color: colors.text },
    scroll: { paddingHorizontal: uScale(SCREEN_PADDING_H), paddingBottom: uScale(24) },
    scanCta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(12),
      backgroundColor: `${colors.accent}24`,
      borderWidth: 1,
      borderColor: `${colors.accent2}4d`,
      borderRadius: uScale(14),
      padding: uScale(13),
      marginBottom: uScale(22),
    },
    scanIcon: {
      width: uScale(34),
      height: uScale(34),
      borderRadius: uScale(10),
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scanMid: { flex: 1 },
    scanTitle: { fontFamily: fontFamilies.bold, fontSize: uFont(13.5), color: colors.text },
    scanSub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(11.5),
      color: colors.textDim,
      marginTop: uScale(1),
    },
    fieldLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(8),
    },
    input: {
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
      fontFamily: fontFamilies.bold,
      fontSize: uFont(14.5),
      color: colors.text,
      marginBottom: uScale(22),
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: uScale(8), marginBottom: uScale(22) },
    chip: {
      paddingHorizontal: uScale(14),
      paddingVertical: uScale(9),
      borderRadius: uScale(100),
      borderWidth: 1,
      borderColor: colors.borderGlass,
      backgroundColor: colors.glass,
    },
    chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipText: { fontFamily: fontFamilies.bold, fontSize: uFont(13), color: colors.textDim },
    chipTextOn: { color: colors.onAccent },
    amountRow: { flexDirection: 'row', gap: uScale(10), marginBottom: uScale(22) },
    amountInput: {
      flex: 1,
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
      fontFamily: fontFamilies.bold,
      fontSize: uFont(20),
      color: colors.text,
    },
    currencyPick: {
      width: uScale(64),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: uScale(4),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
    },
    currencyText: { fontFamily: fontFamilies.bold, fontSize: uFont(14), color: colors.text },
    cyclePills: { flexDirection: 'row', gap: uScale(8), marginBottom: uScale(22) },
    pill: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: uScale(11),
      borderRadius: uScale(10),
      borderWidth: 1,
      borderColor: colors.borderGlass,
      backgroundColor: colors.glass,
    },
    pillOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    pillText: { fontFamily: fontFamilies.bold, fontSize: uFont(12.5), color: colors.textDim },
    pillTextOn: { color: colors.onAccent },
    dateField: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(12),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
      marginBottom: uScale(22),
    },
    dateText: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.text },
    reminderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
    },
    reminderMid: { flex: 1 },
    reminderTitle: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.text },
    reminderSub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(11.5),
      color: colors.textFaint,
      marginTop: uScale(2),
    },
    toggle: {
      width: uScale(40),
      height: uScale(24),
      borderRadius: uScale(12),
      justifyContent: 'center',
    },
    toggleOn: { backgroundColor: colors.accent2 },
    toggleOff: { backgroundColor: colors.glassStrong },
    toggleKnob: {
      width: uScale(20),
      height: uScale(20),
      borderRadius: uScale(10),
      backgroundColor: colors.onAccent,
    },
    toggleKnobOn: { alignSelf: 'flex-end', marginRight: uScale(2) },
    toggleKnobOff: { alignSelf: 'flex-start', marginLeft: uScale(2) },
    bottom: {
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingTop: uScale(12),
      paddingBottom: uScale(4),
    },
  });
