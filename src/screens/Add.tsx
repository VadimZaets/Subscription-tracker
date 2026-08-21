import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import CrossIcon from '@/assets/icon/cross.svg';
import { ChipGroup } from '@/components/form/ChipGroup';
import { LabeledInput } from '@/components/form/LabeledInput';
import { PillGroup } from '@/components/form/PillGroup';
import { ToggleRow } from '@/components/form/ToggleRow';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { createSubscription } from '@/db/queries/subscriptions';
import { strings } from '@/localization/strings';
import { RootStackScreenProps } from '@/navigation/types';
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

export const Add = ({ navigation }: RootStackScreenProps<'Add'>) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('streaming');
  const [amountText, setAmountText] = useState('');
  const [cycle, setCycle] = useState<BillingCycle>('monthly');
  const [firstChargeAt, setFirstChargeAt] = useState(() => new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reminderOn, setReminderOn] = useState(true);
  const [saveError, setSaveError] = useState<string | null>(null);

  const amount = Number(amountText.replace(',', '.'));
  const canSubmit = name.trim().length > 0 && amountText.length > 0 && !Number.isNaN(amount);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((visible) => !visible);
  }, []);

  const handleDateChange = useCallback((_event: unknown, date?: Date) => {
    setShowDatePicker(false);
    if (date) setFirstChargeAt(date);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return;

    setSaveError(null);
    try {
      await createSubscription(
        { name: name.trim(), category, amount, currency: 'UAH', cycle, firstChargeAt },
        new Date(),
      );
      navigation.goBack();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    }
  }, [canSubmit, name, category, amount, cycle, firstChargeAt, navigation]);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <CrossIcon width={uScale(15)} height={uScale(15)} color={colors.text} />
        </Pressable>
        <Text style={styles.title}>{strings.add.title}</Text>
        <View style={styles.closeBtnSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
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
        {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
        <PrimaryButton label={strings.add.submit} onPress={handleSubmit} />
      </View>
    </Screen>
  );
};

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
    error: {
      textAlign: 'center',
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12.5),
      color: colors.red,
      marginBottom: uScale(10),
    },
  });
