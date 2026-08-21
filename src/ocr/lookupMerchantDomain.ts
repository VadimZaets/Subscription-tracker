import { supabase } from '@/lib/supabase';

/** Той самий хост, що й analyzeSubscriptionPhoto.ts (локальна IP Mac у Docker Desktop). */
const SELFHOSTED_OCR_URL = 'http://192.168.0.63:3000';

export type MerchantInfo = { domain: string | null; cancelUrl: string | null };

const asStringOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().toLowerCase() !== 'null'
    ? value
    : null;

const normalizeMerchantName = (name: string): string => name.trim().toLowerCase();

/** Спершу пробуємо спільний Supabase-кеш (заповнює його сервер після AI-запиту,
 *  апка лише читає) — при промасі чи будь-якій мережевій помилці мовчки йдемо
 *  далі до AI, як і раніше. */
const lookupCachedMerchantInfo = async (name: string): Promise<MerchantInfo | null> => {
  if (!supabase) return null;

  const { data } = await supabase
    .from('merchants')
    .select('domain, cancel_url')
    .eq('name', normalizeMerchantName(name))
    .maybeSingle();

  if (!data) return null;
  return { domain: asStringOrNull(data.domain), cancelUrl: asStringOrNull(data.cancel_url) };
};

/**
 * Текстовий (без фото) пошук домену й лінка на скасування підписки за назвою
 * мерчанта — на порядок швидший за повний vision-аналіз, бо не кодує
 * зображення в токени (~3с проти ~60-90с на прогрітій моделі). Викликати після
 * підтвердження імені мерчанта людиною (не раніше — інакше хибне ім'я дасть
 * хибний домен/лінк).
 */
export const lookupMerchantInfo = async (name: string): Promise<MerchantInfo> => {
  const cached = await lookupCachedMerchantInfo(name).catch(() => null);
  if (cached) return cached;

  const response = await fetch(`${SELFHOSTED_OCR_URL}/merchant/domain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) return { domain: null, cancelUrl: null };

  const data = await response.json();
  return {
    domain: asStringOrNull(data.domain),
    cancelUrl: asStringOrNull(data.cancelUrl),
  };
};
