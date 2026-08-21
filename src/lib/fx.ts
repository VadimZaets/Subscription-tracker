import { supabase } from '@/lib/supabase';
import { CurrencyCode } from '@/types/subscription.types';

type FxRateRow = { base: string; quote: string; rate: number };

/**
 * Курс `currency` → UAH (базова валюта відображення Hero-суми). UAH сама
 * себе конвертує 1:1; для USD/EUR читаємо кеш `fx_rates`, який щодня
 * заповнює OCR-сервіс з двох офіційних джерел — NBU (прямі котирування
 * USD/UAH, EUR/UAH) і ECB (EUR/USD, для пар без UAH). Мережева помилка чи
 * відсутність рядка — фолбек на 1 (той самий безпечний дефолт, що був
 * раніше), а не блокування збереження підписки.
 */
export const getFxRateToUAH = async (currency: CurrencyCode): Promise<number> => {
  if (currency === 'UAH') return 1;

  if (!supabase) {
    console.warn(
      '[getFxRateToUAH] Supabase client не налаштований (EXPO_PUBLIC_SUPABASE_URL/ANON_KEY порожні або Metro не перезапущено після .env) — fxRate = 1',
    );
    return 1;
  }

  const { data, error } = await supabase
    .from('fx_rates')
    .select('rate')
    .eq('base', currency)
    .eq('quote', 'UAH')
    .maybeSingle<FxRateRow>();

  if (error) {
    console.warn(`[getFxRateToUAH] Supabase-запит для ${currency}/UAH впав:`, error.message);
    return 1;
  }

  if (!data) {
    console.warn(`[getFxRateToUAH] Немає рядка fx_rates для ${currency}/UAH — fxRate = 1`);
    return 1;
  }

  // rate — numeric-колонка в Postgres, PostgREST іноді серіалізує її як
  // рядок ("44.659"), щоб не втрачати точність — приводимо явно.
  const rate = Number(data.rate);
  if (!Number.isFinite(rate) || rate <= 0) {
    console.warn(`[getFxRateToUAH] Некоректний rate для ${currency}/UAH:`, data.rate);
    return 1;
  }

  return rate;
};

/**
 * Множник для конвертації суми з базового сховища (завжди UAH — кожна
 * підписка вже зберігає власний fxRate саме до UAH) у валюту відображення,
 * обрану в Settings. Не окремий стовпчик у fx_rates — просто інверсія вже
 * закешованого курсу X→UAH, той самий кеш, той самий фолбек на 1 при
 * помилці/відсутності мережі.
 */
export const getFxRateFromUAH = async (currency: CurrencyCode): Promise<number> => {
  if (currency === 'UAH') return 1;

  const rateToUAH = await getFxRateToUAH(currency);
  return rateToUAH > 0 ? 1 / rateToUAH : 1;
};
