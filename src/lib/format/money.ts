import { CurrencyCode } from '@/types/subscription.types';

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  UAH: '₴',
  USD: '$',
  EUR: '€',
};

/** Порядок циклічного перемикання валют в інпутах (Add.tsx, Confirm.tsx). */
export const CURRENCY_CYCLE: CurrencyCode[] = ['UAH', 'USD', 'EUR'];

export const nextCurrency = (current: CurrencyCode): CurrencyCode =>
  CURRENCY_CYCLE[(CURRENCY_CYCLE.indexOf(current) + 1) % CURRENCY_CYCLE.length];

/** Розділювач тисяч, як у макетах ("3 480 ₴") — звичайний пробіл, не Unicode-варіант. */
const THOUSANDS_SEPARATOR = ' ';

const groupThousands = (integerPart: string): string =>
  integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, THOUSANDS_SEPARATOR);

/** Округлення до копійок, не до цілого — інакше "1.99 USD" з реального чека
 *  показувало б "2 $" замість "1,99 $". Ціле число (моки з макетів, "379 ₴")
 *  лишається без десяткової частини, як і раніше. */
export const formatMoney = (amount: number, currency: CurrencyCode = 'UAH'): string => {
  const sign = amount < 0 ? '-' : '';
  const cents = Math.round(Math.abs(amount) * 100);
  const integerPart = Math.trunc(cents / 100);
  const fractionalPart = cents % 100;

  const grouped = groupThousands(String(integerPart));
  const decimals = fractionalPart === 0 ? '' : `,${String(fractionalPart).padStart(2, '0')}`;

  return `${sign}${grouped}${decimals} ${CURRENCY_SYMBOLS[currency]}`;
};
