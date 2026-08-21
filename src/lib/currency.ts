import { getSetting, setSetting } from '@/db/queries/settings';
import { CurrencyCode } from '@/types/subscription.types';

const CURRENCY_SETTING_KEY = 'defaultCurrency';

const isCurrencyCode = (value: string): value is CurrencyCode =>
  value === 'UAH' || value === 'USD' || value === 'EUR';

/** Валюта відображення Hero-суми — за замовчуванням UAH, змінюється в Settings. */
export const getDefaultCurrency = async (): Promise<CurrencyCode> => {
  const stored = await getSetting(CURRENCY_SETTING_KEY);
  return stored && isCurrencyCode(stored) ? stored : 'UAH';
};

export const setDefaultCurrency = (currency: CurrencyCode) =>
  setSetting(CURRENCY_SETTING_KEY, currency);
