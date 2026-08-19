import { CurrencyCode } from '@/types/subscription.types';

const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
};

/** Розділювач тисяч, як у макетах ("3 480 ₴") — звичайний пробіл, не Unicode-варіант. */
const THOUSANDS_SEPARATOR = ' ';

const groupThousands = (integerPart: string): string =>
  integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

export const formatMoney = (amount: number, currency: CurrencyCode = 'UAH'): string => {
  const rounded = Math.round(amount);
  const sign = rounded < 0 ? '-' : '';
  const grouped = groupThousands(String(Math.abs(rounded)));

  return `${sign}${grouped} ${CURRENCY_SYMBOLS[currency]}`;
};
