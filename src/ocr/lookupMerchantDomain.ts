/** Той самий хост, що й analyzeSubscriptionPhoto.ts (локальна IP Mac у Docker Desktop). */
const SELFHOSTED_OCR_URL = 'http://192.168.0.63:3000';

export type MerchantInfo = { domain: string | null; cancelUrl: string | null };

const asStringOrNull = (value: unknown): string | null =>
  typeof value === 'string' && value.trim().length > 0 && value.trim().toLowerCase() !== 'null'
    ? value
    : null;

/**
 * Текстовий (без фото) пошук домену й лінка на скасування підписки за назвою
 * мерчанта — на порядок швидший за повний vision-аналіз, бо не кодує
 * зображення в токени (~3с проти ~60-90с на прогрітій моделі). Викликати після
 * підтвердження імені мерчанта людиною (не раніше — інакше хибне ім'я дасть
 * хибний домен/лінк).
 */
export const lookupMerchantInfo = async (name: string): Promise<MerchantInfo> => {
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
