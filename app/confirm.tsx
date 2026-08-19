import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryBadge } from '@/components/CategoryBadge';
import { LabeledInput } from '@/components/form/LabeledInput';
import { PillGroup } from '@/components/form/PillGroup';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { createSubscription } from '@/db/queries/subscriptions';
import { formatShortDate, toLocalIsoDate } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { strings } from '@/localization/strings';
import { findMerchant } from '@/ocr/merchants.catalog';
import { parseAppStoreScreenshot, ParsedAppStoreSubscription } from '@/ocr/parseAppStoreScreenshot';
import { FieldConfidence, parseReceipt } from '@/ocr/parseReceipt';
import { recognizeText } from '@/ocr/recognizeText';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { BillingCycle, CurrencyCode } from '@/types/subscription.types';
import { uFont, uScale } from '@/utils/uScale';

const CYCLE_OPTIONS = (['weekly', 'monthly', 'yearly'] as BillingCycle[]).map((key) => ({
  key,
  label: strings.cycles[key],
}));

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = { UAH: '₴', USD: '$', EUR: '€' };

const dotColorFor = (colors: ThemeColors, confidence: FieldConfidence | null) =>
  confidence === 'high' ? colors.good : colors.gold;

type BatchItem = ParsedAppStoreSubscription & { selected: boolean };

// Крок 7/8: якщо скріншот містить кілька підписок (Передплати App Store),
// пропонуємо пакетне збереження; інакше падаємо на одиночний чек (parseReceipt).
const Confirm = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  const [loading, setLoading] = useState(Boolean(uri));
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [batchItems, setBatchItems] = useState<BatchItem[] | null>(null);

  const [merchant, setMerchant] = useState('');
  const [merchantConfidence, setMerchantConfidence] = useState<FieldConfidence | null>(null);
  const [amountText, setAmountText] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('UAH');
  const [amountConfidence, setAmountConfidence] = useState<FieldConfidence | null>(null);
  const [chargedAt, setChargedAt] = useState<Date>(() => new Date());
  const [chargedAtConfidence, setChargedAtConfidence] = useState<FieldConfidence | null>(null);
  const [cycle, setCycle] = useState<BillingCycle>('monthly');

  useEffect(() => {
    if (!uri) return;

    recognizeText(uri)
      .then((result) => {
        console.log('[confirm] OCR fullText:', result.fullText);
        result.blocks.forEach((block, index) =>
          console.log(`[confirm] block ${index} [${block.confidence.toFixed(2)}]:`, block.text),
        );

        const now = new Date();
        console.log('[confirm] now:', now.toString());

        const batch = parseAppStoreScreenshot(result, now);
        console.log('[confirm] parseAppStoreScreenshot →', JSON.stringify(batch, null, 2));
        if (batch.length > 0) {
          setBatchItems(batch.map((item) => ({ ...item, selected: true })));
          return;
        }

        const parsed = parseReceipt(result);
        console.log('[confirm] parseReceipt →', JSON.stringify(parsed, null, 2));
        if (parsed.merchant) {
          setMerchant(parsed.merchant.value);
          setMerchantConfidence(parsed.merchant.confidence);
        }
        if (parsed.amount) {
          setAmountText(String(parsed.amount.value.amount));
          setCurrency(parsed.amount.value.currency);
          setAmountConfidence(parsed.amount.confidence);
        }
        if (parsed.chargedAt) {
          console.log(
            '[confirm] chargedAt set to:',
            parsed.chargedAt.value.toString(),
            'formatShortDate:',
            formatShortDate(toLocalIsoDate(parsed.chargedAt.value)),
          );
          setChargedAt(parsed.chargedAt.value);
          setChargedAtConfidence(parsed.chargedAt.confidence);
        }
      })
      .catch((error) => {
        setOcrError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => setLoading(false));
  }, [uri]);

  const amount = Number(amountText.replace(',', '.'));
  const canSave = merchant.trim().length > 0 && amountText.length > 0 && !Number.isNaN(amount);
  const selectedCount = batchItems?.filter((item) => item.selected).length ?? 0;

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleReject = useCallback(() => {
    router.back();
  }, []);

  const handleToggleBatchItem = useCallback((index: number) => {
    setBatchItems((items) =>
      items
        ? items.map((item, i) => (i === index ? { ...item, selected: !item.selected } : item))
        : items,
    );
  }, []);

  const handleSaveBatch = useCallback(async () => {
    if (!batchItems || selectedCount === 0) return;

    setSaveError(null);
    const now = new Date();
    try {
      for (const item of batchItems) {
        if (!item.selected) continue;
        await createSubscription(
          {
            name: item.name,
            category: item.category,
            amount: item.amount,
            currency: item.currency,
            cycle: 'monthly',
            firstChargeAt: item.renewsAt ?? now,
            source: 'app_store_screenshot',
          },
          now,
        );
      }
      router.dismissAll();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    }
  }, [batchItems, selectedCount]);

  const handleSaveSingle = useCallback(async () => {
    if (!canSave) return;

    setSaveError(null);
    const trimmedName = merchant.trim();
    try {
      await createSubscription(
        {
          name: trimmedName,
          category: findMerchant(trimmedName)?.category ?? 'other',
          amount,
          currency,
          cycle,
          firstChargeAt: chargedAt,
          source: 'receipt',
        },
        new Date(),
      );
      router.dismissAll();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    }
  }, [canSave, merchant, amount, currency, cycle, chargedAt]);

  const renderBatch = (items: BatchItem[]) => (
    <>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.batchTitle}>{strings.confirm.batchTitle(items.length)}</Text>
        {items.map((item, index) => (
          <Pressable
            key={`${item.name}-${index}`}
            onPress={() => handleToggleBatchItem(index)}
            style={styles.batchRow}
          >
            <CategoryBadge category={item.category} color={colors.accent2} size={38} />
            <View style={styles.batchMid}>
              <Text style={styles.batchName}>{item.name}</Text>
              <Text style={styles.batchSub}>{item.renewsAtText}</Text>
            </View>
            <Text style={styles.batchPrice}>{formatMoney(item.amount, item.currency)}</Text>
            <View style={[styles.checkbox, item.selected && styles.checkboxOn]}>
              {item.selected ? (
                <Ionicons name="checkmark" size={uScale(13)} color={colors.onAccent} />
              ) : null}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.bottom}>
        {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
        <PrimaryButton label={strings.confirm.saveBatch(selectedCount)} onPress={handleSaveBatch} />
        <Pressable onPress={handleReject}>
          <Text style={styles.notASubscription}>{strings.confirm.notASubscription}</Text>
        </Pressable>
      </View>
    </>
  );

  const renderSingle = () => (
    <>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.fieldRow}>
          <View
            style={[styles.confDot, { backgroundColor: dotColorFor(colors, merchantConfidence) }]}
          />
          <View style={styles.fieldMid}>
            <LabeledInput
              label={strings.confirm.merchantLabel}
              value={merchant}
              onChangeText={setMerchant}
              placeholder="Netflix"
            />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View
            style={[styles.confDot, { backgroundColor: dotColorFor(colors, amountConfidence) }]}
          />
          <View style={styles.fieldMid}>
            <LabeledInput
              label={strings.confirm.amountLabel}
              value={amountText}
              onChangeText={setAmountText}
              placeholder="0,00"
              keyboardType="decimal-pad"
              rightAdornment={
                <View style={styles.currencyPick}>
                  <Text style={styles.currencyText}>{CURRENCY_SYMBOLS[currency]}</Text>
                </View>
              }
            />
          </View>
        </View>

        <PillGroup
          label={strings.confirm.periodLabel}
          options={CYCLE_OPTIONS}
          value={cycle}
          onChange={setCycle}
        />

        <View style={styles.fieldRow}>
          <View
            style={[styles.confDot, { backgroundColor: dotColorFor(colors, chargedAtConfidence) }]}
          />
          <View style={styles.fieldMid}>
            <Text style={styles.fieldLabel}>{strings.confirm.nextChargeLabel}</Text>
            <Text style={styles.fieldValue}>{formatShortDate(toLocalIsoDate(chargedAt))}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
        <PrimaryButton label={strings.confirm.save} onPress={handleSaveSingle} />
        <Pressable onPress={handleReject}>
          <Text style={styles.notASubscription}>{strings.confirm.notASubscription}</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Text style={styles.title}>{strings.confirm.title}</Text>
        <Pressable onPress={handleClose} style={styles.closeBtn}>
          <Ionicons name="close" size={uScale(15)} color={colors.text} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingRow}>
          <ActivityIndicator color={colors.accent2} />
          <Text style={styles.loadingText}>{strings.confirm.recognizing}</Text>
        </View>
      ) : null}
      {ocrError ? <Text style={styles.error}>{ocrError}</Text> : null}

      {!loading && batchItems ? renderBatch(batchItems) : null}
      {!loading && !batchItems ? renderSingle() : null}
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
    loadingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: uScale(8),
      marginTop: uScale(30),
    },
    loadingText: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12),
      color: colors.textFaint,
    },
    error: {
      textAlign: 'center',
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12.5),
      color: colors.red,
      marginBottom: uScale(14),
    },
    fieldRow: { flexDirection: 'row', alignItems: 'flex-start', gap: uScale(10) },
    confDot: {
      width: uScale(9),
      height: uScale(9),
      borderRadius: uScale(5),
      marginTop: uScale(20),
    },
    fieldMid: { flex: 1 },
    fieldLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(8),
    },
    fieldValue: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(14.5),
      color: colors.text,
      marginBottom: uScale(22),
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
    batchTitle: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(16),
      color: colors.text,
      marginBottom: uScale(14),
    },
    batchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(10),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(12),
      marginBottom: uScale(8),
    },
    batchMid: { flex: 1, minWidth: 0 },
    batchName: { fontFamily: fontFamilies.bold, fontSize: uFont(13.5), color: colors.text },
    batchSub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(11.5),
      color: colors.textFaint,
      marginTop: uScale(1),
    },
    batchPrice: { fontFamily: fontFamilies.semiBold, fontSize: uFont(12.5), color: colors.textDim },
    checkbox: {
      width: uScale(20),
      height: uScale(20),
      borderRadius: uScale(10),
      borderWidth: 1.5,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: { backgroundColor: colors.good, borderColor: colors.good },
  });
