import { resolveMonthIndex } from '@/lib/format/ukrainianMonth';
import { OcrResult } from '@/ocr/recognizeText';
import { CurrencyCode } from '@/types/subscription.types';

export type FieldConfidence = 'high' | 'low';

export type ParsedField<T> = { value: T; confidence: FieldConfidence };

export type ParsedReceipt = {
  merchant: ParsedField<string> | null;
  amount: ParsedField<{ amount: number; currency: CurrencyCode }> | null;
  chargedAt: ParsedField<Date> | null;
};

const CURRENCY_ALIASES: Record<string, CurrencyCode> = {
  грн: 'UAH',
  '₴': 'UAH',
  uah: 'UAH',
  usd: 'USD',
  $: 'USD',
  eur: 'EUR',
  '€': 'EUR',
};

const AMOUNT_RE = /(\d+(?:[.,]\d{2}))\s*(грн|₴|usd|eur|\$|€)/gi;

const DATE_RE = /(\d{1,2})\s+([а-яіїєґ]+)\.?\s+(\d{4})/i;

const findMerchantField = (blocks: OcrResult['blocks']): ParsedField<string> | null => {
  const candidate = blocks.find((block) => {
    const trimmed = block.text.trim();
    return trimmed.length >= 3 && !/^\d/.test(trimmed);
  });

  return candidate ? { value: candidate.text.trim(), confidence: 'low' } : null;
};

const findAmountField = (
  text: string,
): ParsedField<{ amount: number; currency: CurrencyCode }> | null => {
  const matches = [...text.matchAll(AMOUNT_RE)];
  if (!matches.length) return null;

  const counts = new Map<string, number>();
  for (const match of matches) {
    const currency = CURRENCY_ALIASES[match[2].toLowerCase()];
    if (!currency) continue;
    const key = `${match[1].replace(',', '.')}|${currency}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  if (!counts.size) return null;

  // Сума в чеку зазвичай повторюється (підсумок, рядок товару, «до сплати») —
  // найчастіше значення надійніше за перше знайдене.
  const [[bestKey, bestCount]] = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const [amountText, currency] = bestKey.split('|');

  return {
    value: { amount: Number(amountText), currency: currency as CurrencyCode },
    confidence: bestCount > 1 ? 'high' : 'low',
  };
};

const findChargedAtField = (text: string): ParsedField<Date> | null => {
  const match = text.match(DATE_RE);
  if (!match) return null;

  const monthIndex = resolveMonthIndex(match[2]);
  if (monthIndex === -1) return null;

  const day = Number(match[1]);
  const year = Number(match[3]);

  return { value: new Date(year, monthIndex, day), confidence: 'high' };
};

/** Евристики без LLM: сума, дата, матч мерчанта. Кожне поле несе власну впевненість,
 *  щоб confirm.tsx показував реальні крапки, а не заглушку. */
export const parseReceipt = (result: OcrResult): ParsedReceipt => {
  const text = result.fullText || result.blocks.map((block) => block.text).join(' ');

  return {
    merchant: findMerchantField(result.blocks),
    amount: findAmountField(text),
    chargedAt: findChargedAtField(text),
  };
};
