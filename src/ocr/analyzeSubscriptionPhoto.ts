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

/**
 * Повне AI-розпізнавання фото підписки: шле фото (не текст) на селфгостед-сервіс
 * (Subscription-tracker-ocr), який питає Groq. Домен свідомо НЕ входить у цю
 * відповідь — його питаємо окремим текстовим запитом (lookupMerchantDomain)
 * лише після того, як користувач підтвердить ім'я мерчанта, бо тут воно ще
 * може бути неточним. Основний шлях для одиночного фото в confirm.tsx (усе,
 * крім скріншота App Store з кількома підписками — той лишається на
 * детермінованому parseAppStoreScreenshot).
 */
export const analyzeSubscriptionPhoto = async (uri: string): Promise<AnalyzedSubscription> => {
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

  return {
    merchantName: asStringOrNull(data.merchantName) ?? '',
    amount: typeof data.amount === 'number' ? data.amount : 0,
    currency: asCurrency(data.currency),
    cycle: asCycle(data.cycle),
    chargedAt: asChargedAt(data.chargedAtDate),
    confidence: data.confidence === 'high' ? 'high' : 'low',
  };
};
