import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ChipGroup } from '@/components/form/ChipGroup';
import { LabeledInput } from '@/components/form/LabeledInput';
import { PillGroup } from '@/components/form/PillGroup';
import { ToggleRow } from '@/components/form/ToggleRow';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { createSubscription } from '@/db/queries/subscriptions';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { Category } from '@/types/category.types';
import { BillingCycle } from '@/types/subscription.types';
import { uFont, uScale } from '@/utils/uScale';

const CATEGORY_OPTIONS = (
  ['streaming', 'software', 'fitness', 'games', 'cloud', 'other'] as Category[]
).map((key) => ({ key, label: strings.categories[key] }));

const CYCLE_OPTIONS = (['weekly', 'monthly', 'yearly', 'once'] as BillingCycle[]).map((key) => ({
  key,
  label: strings.cycles[key],
}));

const DATE_FORMATTER = new Intl.DateTimeFormat('uk-UA', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const AddSubscription = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('streaming');
  const [amountText, setAmountText] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [firstChargeAt, setFirstChargeAt] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderOn, setReminderOn] = useState(true);

  const amount = Number(amountText.replace(',', '.'));
  const canSubmit = name.trim().length > 0 && amountText.length > 0 && !Number.isNaN(amount);

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleScanInstead = useCallback(() => {
    router.replace('/onboarding/scan');
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((visible) => !visible);
  }, []);

  const handleDateChange = useCallback((_event: unknown, date?: Date) => {
    setShowDatePicker(false);
    if (date) setFirstChargeAt(date);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    createSubscription(
      { name: name.trim(), category, amount, currency: 'UAH', cycle, firstChargeAt },
      new Date(),
    );
    router.back();
  }, [canSubmit, name, category, amount, cycle, firstChargeAt]);

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
            <Ionicons name="camera" size={uScale(17)} color={colors.onAccent} />
          </View>
          <View style={styles.scanMid}>
            <Text style={styles.scanTitle}>{strings.add.scanCtaTitle}</Text>
            <Text style={styles.scanSub}>{strings.add.scanCtaSub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={uScale(15)} color={colors.textDim} />
        </Pressable>

        <LabeledInput
          label={strings.add.merchantLabel}
          value={name}
          onChangeText={setName}
          placeholder="Netflix"
        />

        <ChipGroup
          label={strings.add.categoryLabel}
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={setCategory}
        />

        <LabeledInput
          label={strings.add.amountLabel}
          value={amountText}
          onChangeText={setAmountText}
          placeholder="0,00"
          keyboardType="decimal-pad"
          rightAdornment={
            <View style={styles.currencyPick}>
              <Text style={styles.currencyText}>₴</Text>
            </View>
          }
        />

        <PillGroup
          label={strings.add.cycleLabel}
          options={CYCLE_OPTIONS}
          value={cycle}
          onChange={setCycle}
        />

        <Text style={styles.fieldLabel}>{strings.add.firstChargeLabel}</Text>
        <Pressable onPress={handleToggleDatePicker} style={styles.dateField}>
          <Ionicons name="calendar-outline" size={uScale(16)} color={colors.textDim} />
          <Text style={styles.dateText}>{DATE_FORMATTER.format(firstChargeAt)}</Text>
        </Pressable>
        {showDatePicker ? (
          <DateTimePicker value={firstChargeAt} mode="date" onChange={handleDateChange} />
        ) : null}

        <ToggleRow
          title={strings.add.reminderTitle}
          subtitle={strings.add.reminderSub}
          value={reminderOn}
          onChange={setReminderOn}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryButton label={strings.add.submit} onPress={handleSubmit} />
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
    currencyPick: {
      width: uScale(50),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
    },
    currencyText: { fontFamily: fontFamilies.bold, fontSize: uFont(14), color: colors.text },
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
    bottom: {
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingTop: uScale(12),
      paddingBottom: uScale(4),
    },
  });
