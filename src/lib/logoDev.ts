// Publishable-ключ Logo.dev — офіційно безпечний для клієнтського коду
// (аналог Stripe pk_*, не секрет). https://www.logo.dev/docs/logo-images/introduction
const LOGO_DEV_PUBLISHABLE_KEY = 'pk_EfzuCDgQQJiTfdzidIrePA';

const buildLogoUrl = (path: string, size: number): string => {
  const params = new URLSearchParams({
    token: LOGO_DEV_PUBLISHABLE_KEY,
    size: String(Math.round(size * 2)), // вдвічі більше під retina
    format: 'png',
    retina: 'true',
    fallback: '404', // без цього CDN підміняє непізнаний бренд монограмою — не відрізнити від помилки
    // Застосунок лише темний — CDN сам компонує прозорі/монохромні лого під темний
    // фон, тож власне біле коло під картинкою більше не потрібне (MerchantLogo.tsx).
    theme: 'dark',
  });
  return `https://img.logo.dev/${path}?${params.toString()}`;
};

/** Точний домен (Supabase-кеш або AI) — єдиний надійний шлях. Пошук за назвою
 *  свідомо не використовується (див. MerchantLogo.tsx) — нечіткий збіг гірше,
 *  ніж чесна відсутність лого. */
export const buildLogoUrlByDomain = (domain: string, size: number): string =>
  buildLogoUrl(domain, size);
