import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';

import { parseIsoDate } from '@/lib/format/date';
import { BillingCycle, CurrencyCode } from '@/types/subscription.types';

/** Локальна IP-адреса Mac у Docker Desktop — працює, лише поки телефон і Mac в
 *  одній Wi-Fi мережі. Замінити на реальний URL після деплою на VPS
 *  (Subscription-tracker-ocr/README.md). */
const SELFHOSTED_OCR_URL = 'http://192.168.0.63:3000';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export type AnalyzedSubscription = {
  merchantName: string;
  amount: number;
  currency: CurrencyCode;
  cycle: BillingCycle;
  chargedAt: Date | null;
  confidence: 'high' | 'low';
};

const KNOWN_CURRENCIES: CurrencyCode[] = ['UAH', 'USD', 'EUR'];
const KNOWN_CYCLES: BillingCycle[] = ['weekly', 'monthly', 'yearly', 'once'];

const asStringOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().toLowerCase() !== 'null'
    ? value
    : null;

const asCurrency = (value: unknown): CurrencyCode =>
  KNOWN_CURRENCIES.includes(value as CurrencyCode) ? (value as CurrencyCode) : 'UAH';

const asCycle = (value: unknown): BillingCycle =>
  KNOWN_CYCLES.includes(value as BillingCycle) ? (value as BillingCycle) : 'monthly';

const asChargedAt = (value: unknown): Date | null => {
  const str = asStringOrNull(value);
  return str && DATE_RE.test(str) ? parseIsoDate(str) : null;
};

const toAnalyzedSubscription = (item: Record<string, unknown>): AnalyzedSubscription => ({
  merchantName: asStringOrNull(item.merchantName) ?? '',
  amount: typeof item.amount === 'number' ? item.amount : 0,
  currency: asCurrency(item.currency),
  cycle: asCycle(item.cycle),
  chargedAt: asChargedAt(item.chargedAtDate),
  confidence: item.confidence === 'high' ? 'high' : 'low',
});

/**
 * Повне AI-розпізнавання фото підписки/підписок: шле фото (не текст) на
 * селфгостед-сервіс (Subscription-tracker-ocr), який питає Groq. Повертає
 * масив — один елемент для звичайного чека, кілька для скріншота
 * "Підписки" App/Play Store. Домен свідомо НЕ входить у цю відповідь — його
 * питаємо окремим текстовим запитом (lookupMerchantDomain) лише після того,
 * як користувач підтвердить ім'я мерчанта, бо тут воно ще може бути неточним.
 */
export const analyzeSubscriptionPhoto = async (uri: string): Promise<AnalyzedSubscription[]> => {
  const base64 = await readAsStringAsync(uri, { encoding: EncodingType.Base64 });

  const response = await fetch(`${SELFHOSTED_OCR_URL}/subscription/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: base64 }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.log('[analyzeSubscriptionPhoto] HTTP error', response.status, errorBody);
    throw new Error(`Аналіз не вдався (${response.status})`);
  }

  const data = await response.json();
  console.log('[analyzeSubscriptionPhoto] raw response:', JSON.stringify(data, null, 2));

  const subscriptions: unknown = Array.isArray(data.subscriptions) ? data.subscriptions : [];
  return (subscriptions as Record<string, unknown>[]).map(toAnalyzedSubscription);
};
