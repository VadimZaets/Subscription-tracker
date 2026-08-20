/** Той самий хост, що й analyzeSubscriptionPhoto.ts (локальна IP Mac у Docker Desktop). */
const SELFHOSTED_OCR_URL = 'http://192.168.0.63:3000';

/**
 * Текстовий (без фото) пошук домену за назвою мерчанта — на порядок швидший за
 * повний vision-аналіз, бо не кодує зображення в токени (~3с проти ~60-90с на
 * прогрітій моделі). Викликати у фоні, не блокуючи форму: результат лише
 * підміняє іконку, коли прийде.
 */
export const lookupMerchantDomain = async (name: string): Promise<string | null> => {
  const response = await fetch(`${SELFHOSTED_OCR_URL}/merchant/domain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return typeof data.domain === 'string' && data.domain.trim().toLowerCase() !== 'null'
    ? data.domain
    : null;
};
