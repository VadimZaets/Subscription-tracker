import { resolveNextOccurrence } from '@/lib/format/ukrainianMonth';
import { OcrResult } from '@/ocr/recognizeText';
import { Category } from '@/types/category.types';
import { CurrencyCode } from '@/types/subscription.types';

export type ParsedAppStoreSubscription = {
  name: string;
  category: Category;
  amount: number;
  currency: CurrencyCode;
  /** Сирий текст дати з екрана ("23 серпня") — для показу користувачу як є. */
  renewsAtText: string;
  /** Той самий текст, приведений до конкретної дати (рік вирахуваний від `now`). */
  renewsAt: Date | null;
};

const STATUS_LINE_RE = /^(Поновиться|Сплила)\s+(.+)$/;
const PRICE_LINE_RE = /^(\d+(?:[.,]\d{2})?)\s*([A-Z]{3})\s*>?\s*$/;
const DAY_MONTH_RE = /(\d{1,2})\s+([а-яіїєґ]+)/i;
const KNOWN_CURRENCIES: CurrencyCode[] = ['UAH', 'USD', 'EUR'];

const parseCurrency = (code: string): CurrencyCode | undefined =>
  KNOWN_CURRENCIES.includes(code as CurrencyCode) ? (code as CurrencyCode) : undefined;

const resolveRenewsAt = (renewsAtText: string, now: Date): Date | null => {
  const match = renewsAtText.match(DAY_MONTH_RE);
  if (!match) return null;
  return resolveNextOccurrence(Number(match[1]), match[2], now);
};

/**
 * Детермінований парсер екрана Налаштування → [Ім'я] → Передплати.
 * Верстка фіксована: на кожну підписку — «назва / підзаголовок / статус / [ціна]»,
 * рядок статусу — найнадійніший якір (регулярний вираз, не позиція). Прострочені
 * підписки («Сплила», без рядка ціни) свідомо пропускаються — немає суми для імпорту.
 */
export const parseAppStoreScreenshot = (
  result: OcrResult,
  now: Date,
): ParsedAppStoreSubscription[] => {
  const lines = result.blocks.map((block) => block.text.trim());
  const parsed: ParsedAppStoreSubscription[] = [];

  lines.forEach((line, index) => {
    const statusMatch = line.match(STATUS_LINE_RE);
    if (!statusMatch || statusMatch[1] !== 'Поновиться') return;

    const priceMatch = lines[index + 1]?.match(PRICE_LINE_RE);
    if (!priceMatch) return;

    const currency = parseCurrency(priceMatch[2]);
    if (!currency) return;

    const name = lines[index - 2];
    if (!name) return;

    const renewsAtText = statusMatch[2];

    parsed.push({
      name,
      category: 'other',
      amount: Number(priceMatch[1].replace(',', '.')),
      currency,
      renewsAtText,
      renewsAt: resolveRenewsAt(renewsAtText, now),
    });
  });

  return parsed;
};
