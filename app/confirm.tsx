import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LabeledInput } from '@/components/form/LabeledInput';
import { PillGroup } from '@/components/form/PillGroup';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { createSubscription } from '@/db/queries/subscriptions';
import { computeNextChargeAt } from '@/lib/billing/nextCharge';
import { formatShortDate, toLocalIsoDate } from '@/lib/format/date';
import { strings } from '@/localization/strings';
import { analyzeSubscriptionPhoto } from '@/ocr/analyzeSubscriptionPhoto';
import { lookupMerchantDomain } from '@/ocr/lookupMerchantDomain';
import { findMerchant } from '@/ocr/merchants.catalog';
import { parseAppStoreScreenshot } from '@/ocr/parseAppStoreScreenshot';
import { FieldConfidence, parseReceipt } from '@/ocr/parseReceipt';
import { recognizeText } from '@/ocr/recognizeText';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { BillingCycle, CurrencyCode, SubscriptionSource } from '@/types/subscription.types';
import { uFont, uScale } from '@/utils/uScale';

const CYCLE_OPTIONS = (['weekly', 'monthly', 'yearly'] as BillingCycle[]).map((key) => ({
  key,
  label: strings.cycles[key],
}));

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = { UAH: '₴', USD: '$', EUR: '€' };

const dotColorFor = (colors: ThemeColors, confidence: FieldConfidence | null) =>
  confidence === 'high' ? colors.good : colors.gold;

/** Один рядок форми — і одиночний чек, і кожна підписка з пакетного скріншота
 *  рендеряться цим самим редагованим карткою, а не окремими шаблонами. */
type EditableItem = {
  key: string;
  name: string;
  nameConfidence: FieldConfidence | null;
  /** З AI-розпізнавання фото; catalog.ts за (відредагованою) назвою на save має пріоритет. */
  domain: string | null;
  amountText: string;
  amountConfidence: FieldConfidence | null;
  currency: CurrencyCode;
  cycle: BillingCycle;
  /** Дата зі старого інвойсу/скріна — не показуємо напряму, лише як якір для
   *  computeNextChargeAt (людина може сфотографувати чек багатомісячної давнини). */
  chargedAt: Date;
  chargedAtConfidence: FieldConfidence | null;
  selected: boolean;
  source: SubscriptionSource;
};

let keySeq = 0;
const nextKey = () => `item-${keySeq++}`;

// Крок 7/8: якщо скріншот містить кілька підписок (Передплати App Store), кожна
// стає своєю редагованою карткою в тому самому списку; інакше — одна картка (чек).
const Confirm = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const { uri } = useLocalSearchParams<{ uri?: string }>();

  const [loading, setLoading] = useState(Boolean(uri));
  const [ocrError, setOcrError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [items, setItems] = useState<EditableItem[]>([]);

  useEffect(() => {
    if (!uri) return;

    // Локальний OCR — перший крок завжди: (а) безкоштовно й миттєво відрізняє
    // скріншот App Store з кількома підписками (детермінований
    // parseAppStoreScreenshot, 100% на реальних тестах), (б) для одиночного чека
    // пробує локальний регексний parseReceipt — якщо витягнув і мерчанта, і суму,
    // AI взагалі не викликаємо (миттєво й безкоштовно). AI (Groq) — лише
    // фолбек, коли лого без читабельного тексту й локальний парсинг не впорався.
    // Домен тут ніколи не питаємо — ім'я мерчанта на цьому кроці ще
    // непідтверджене людиною, і хибне ім'я дало б хибний домен.
    recognizeText(uri)
      .then(async (result) => {
        const now = new Date();
        const batch = parseAppStoreScreenshot(result, now);
        if (batch.length > 0) {
          const batchItems: EditableItem[] = batch.map((sub) => ({
            key: nextKey(),
            name: sub.name,
            nameConfidence: 'high',
            domain: findMerchant(sub.name)?.domain ?? null,
            amountText: String(sub.amount),
            amountConfidence: 'high',
            currency: sub.currency,
            cycle: 'monthly',
            chargedAt: sub.renewsAt ?? now,
            chargedAtConfidence: sub.renewsAt ? 'high' : null,
            selected: true,
            source: 'app_store_screenshot',
          }));
          setItems(batchItems);
          return;
        }

        const parsed = parseReceipt(result);
        const localOk = Boolean(parsed.merchant?.value) && Boolean(parsed.amount);

        const item: EditableItem = localOk
          ? {
              key: nextKey(),
              name: parsed.merchant!.value,
              nameConfidence: parsed.merchant!.confidence,
              domain: findMerchant(parsed.merchant!.value)?.domain ?? null,
              amountText: String(parsed.amount!.value.amount),
              amountConfidence: parsed.amount!.confidence,
              currency: parsed.amount!.value.currency,
              cycle: 'monthly',
              chargedAt: parsed.chargedAt?.value ?? now,
              chargedAtConfidence: parsed.chargedAt?.confidence ?? null,
              selected: true,
              source: 'receipt',
            }
          : await (async () => {
              const analyzed = await analyzeSubscriptionPhoto(uri);
              return {
                key: nextKey(),
                name: analyzed.merchantName,
                nameConfidence: analyzed.confidence,
                domain: findMerchant(analyzed.merchantName)?.domain ?? null,
                amountText: analyzed.amount ? String(analyzed.amount) : '',
                amountConfidence: analyzed.confidence,
                currency: analyzed.currency,
                cycle: analyzed.cycle,
                chargedAt: analyzed.chargedAt ?? now,
                chargedAtConfidence: analyzed.chargedAt ? analyzed.confidence : null,
                selected: true,
                source: 'receipt' as const,
              };
            })();

        setItems([item]);
      })
      .catch((error) => {
        setOcrError(error instanceof Error ? error.message : String(error));
      })
      .finally(() => setLoading(false));
  }, [uri]);

  const isBatch = items.length > 1;
  const selectedItems = items.filter((item) => item.selected);
  const canSave = selectedItems.every((item) => {
    const amount = Number(item.amountText.replace(',', '.'));
    return item.name.trim().length > 0 && item.amountText.length > 0 && !Number.isNaN(amount);
  });

  const handleClose = useCallback(() => {
    router.back();
  }, []);

  const handleReject = useCallback(() => {
    router.back();
  }, []);

  const updateItem = useCallback((key: string, patch: Partial<EditableItem>) => {
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  }, []);

  const handleToggleItem = useCallback((key: string) => {
    setItems((current) =>
      current.map((item) => (item.key === key ? { ...item, selected: !item.selected } : item)),
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (!canSave || selectedItems.length === 0) return;

    setSaveError(null);
    const now = new Date();
    try {
      for (const item of selectedItems) {
        const trimmedName = item.name.trim();
        // Ім'я мерчанта тепер підтверджене людиною (вона могла його виправити
        // в полі форми) — саме тут, а не раніше, безпечно питати AI про домен.
        const catalogDomain = findMerchant(trimmedName)?.domain ?? null;
        const domain =
          catalogDomain ??
          item.domain ??
          (await lookupMerchantDomain(trimmedName).catch(() => null));

        await createSubscription(
          {
            name: trimmedName,
            category: findMerchant(trimmedName)?.category ?? 'other',
            domain,
            amount: Number(item.amountText.replace(',', '.')),
            currency: item.currency,
            cycle: item.cycle,
            firstChargeAt: item.chargedAt,
            source: item.source,
          },
          now,
        );
      }
      router.dismissAll();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : String(error));
    }
  }, [canSave, selectedItems]);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Text style={styles.title}>
          {isBatch ? strings.confirm.batchTitle(items.length) : strings.confirm.title}
        </Text>
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

      {!loading && items.length > 0 ? (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            {items.map((item) => (
              <View key={item.key} style={isBatch ? styles.card : undefined}>
                {isBatch ? (
                  <Pressable onPress={() => handleToggleItem(item.key)} style={styles.cardHeader}>
                    <View style={[styles.checkbox, item.selected && styles.checkboxOn]}>
                      {item.selected ? (
                        <Ionicons name="checkmark" size={uScale(13)} color={colors.onAccent} />
                      ) : null}
                    </View>
                    <Text style={styles.cardHeaderLabel}>
                      {item.selected ? strings.confirm.included : strings.confirm.excluded}
                    </Text>
                  </Pressable>
                ) : null}

                <View style={styles.fieldRow}>
                  <View
                    style={[
                      styles.confDot,
                      { backgroundColor: dotColorFor(colors, item.nameConfidence) },
                    ]}
                  />
                  <View style={styles.fieldMid}>
                    <LabeledInput
                      label={strings.confirm.merchantLabel}
                      value={item.name}
                      onChangeText={(name) => updateItem(item.key, { name })}
                      placeholder="Netflix"
                    />
                  </View>
                </View>

                <View style={styles.fieldRow}>
                  <View
                    style={[
                      styles.confDot,
                      { backgroundColor: dotColorFor(colors, item.amountConfidence) },
                    ]}
                  />
                  <View style={styles.fieldMid}>
                    <LabeledInput
                      label={strings.confirm.amountLabel}
                      value={item.amountText}
                      onChangeText={(amountText) => updateItem(item.key, { amountText })}
                      placeholder="0,00"
                      keyboardType="decimal-pad"
                      rightAdornment={
                        <View style={styles.currencyPick}>
                          <Text style={styles.currencyText}>{CURRENCY_SYMBOLS[item.currency]}</Text>
                        </View>
                      }
                    />
                  </View>
                </View>

                <PillGroup
                  label={strings.confirm.periodLabel}
                  options={CYCLE_OPTIONS}
                  value={item.cycle}
                  onChange={(cycle) => updateItem(item.key, { cycle })}
                />

                <View style={styles.fieldRow}>
                  <View
                    style={[
                      styles.confDot,
                      { backgroundColor: dotColorFor(colors, item.chargedAtConfidence) },
                    ]}
                  />
                  <View style={styles.fieldMid}>
                    <Text style={styles.fieldLabel}>{strings.confirm.nextChargeLabel}</Text>
                    <Text style={styles.fieldValue}>
                      {formatShortDate(
                        toLocalIsoDate(computeNextChargeAt(item.chargedAt, item.cycle, new Date())),
                      )}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.bottom}>
            {saveError ? <Text style={styles.error}>{saveError}</Text> : null}
            <PrimaryButton
              label={
                isBatch ? strings.confirm.saveBatch(selectedItems.length) : strings.confirm.save
              }
              onPress={handleSave}
            />
            <Pressable onPress={handleReject}>
              <Text style={styles.notASubscription}>{strings.confirm.notASubscription}</Text>
            </Pressable>
          </View>
        </>
      ) : null}
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
    card: {
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(16),
      padding: uScale(14),
      marginBottom: uScale(16),
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(8),
      marginBottom: uScale(14),
    },
    cardHeaderLabel: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12),
      color: colors.textFaint,
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
