import { Category } from '@/types/category.types';

export type MerchantCatalogEntry = {
  name: string;
  category: Category;
  color: string;
  /** Малими літерами, без діакритики — з чим звіряємо розпізнаний текст. */
  aliases: string[];
};

// Топ-50 мерчантів: один словник обслуговує матчинг у OCR, дефолтну категорію
// і брендовий колір рядка таймлайну (замість трьох окремих механізмів).
export const merchantCatalog: MerchantCatalogEntry[] = [
  { name: 'Netflix', category: 'streaming', color: '#E44830', aliases: ['netflix'] },
  {
    name: 'YouTube Premium',
    category: 'streaming',
    color: '#FD402C',
    aliases: ['youtube premium', 'youtube'],
  },
  { name: 'Spotify', category: 'streaming', color: '#1DB954', aliases: ['spotify'] },
  { name: 'Apple Music', category: 'streaming', color: '#FA233B', aliases: ['apple music'] },
  { name: 'Apple TV+', category: 'streaming', color: '#000000', aliases: ['apple tv'] },
  { name: 'Disney+', category: 'streaming', color: '#113CCF', aliases: ['disney+', 'disney plus'] },
  { name: 'HBO Max', category: 'streaming', color: '#8B5CF6', aliases: ['hbo max', 'max.com'] },
  {
    name: 'Amazon Prime Video',
    category: 'streaming',
    color: '#00A8E1',
    aliases: ['prime video', 'amazon prime'],
  },
  { name: 'Twitch', category: 'streaming', color: '#9146FF', aliases: ['twitch'] },
  { name: 'SoundCloud', category: 'streaming', color: '#FF5500', aliases: ['soundcloud'] },
  { name: 'Megogo', category: 'streaming', color: '#00C2FF', aliases: ['megogo'] },
  { name: 'Sweet.tv', category: 'streaming', color: '#FF6A00', aliases: ['sweet.tv', 'sweet tv'] },
  { name: 'Kyivstar TV', category: 'streaming', color: '#FFD100', aliases: ['kyivstar tv'] },

  { name: 'iCloud+', category: 'cloud', color: '#3ED598', aliases: ['icloud'] },
  {
    name: 'Google One',
    category: 'cloud',
    color: '#4285F4',
    aliases: ['google one', 'google storage'],
  },
  { name: 'Dropbox', category: 'cloud', color: '#0061FF', aliases: ['dropbox'] },
  {
    name: 'Microsoft 365',
    category: 'cloud',
    color: '#EB3C00',
    aliases: ['microsoft 365', 'office 365'],
  },

  { name: 'Notion', category: 'software', color: '#000000', aliases: ['notion'] },
  { name: 'Figma', category: 'software', color: '#F24E1E', aliases: ['figma'] },
  { name: 'Adobe Creative Cloud', category: 'software', color: '#FF0000', aliases: ['adobe'] },
  { name: 'Canva', category: 'software', color: '#00C4CC', aliases: ['canva'] },
  { name: 'ChatGPT Plus', category: 'software', color: '#10A37F', aliases: ['chatgpt', 'openai'] },
  {
    name: 'Claude Pro',
    category: 'software',
    color: '#D97757',
    aliases: ['claude.ai', 'anthropic'],
  },
  { name: 'GitHub', category: 'software', color: '#181717', aliases: ['github'] },
  { name: 'Grammarly', category: 'software', color: '#15C39A', aliases: ['grammarly'] },
  { name: '1Password', category: 'software', color: '#1A285F', aliases: ['1password'] },
  { name: 'NordVPN', category: 'software', color: '#4687FF', aliases: ['nordvpn'] },
  { name: 'LinkedIn Premium', category: 'software', color: '#0A66C2', aliases: ['linkedin'] },
  { name: 'Duolingo', category: 'software', color: '#58CC02', aliases: ['duolingo'] },

  {
    name: 'Discord Nitro',
    category: 'games',
    color: '#9146FF',
    aliases: ['discord nitro', 'discord'],
  },
  {
    name: 'PlayStation Plus',
    category: 'games',
    color: '#0070D1',
    aliases: ['playstation plus', 'psn'],
  },
  {
    name: 'Xbox Game Pass',
    category: 'games',
    color: '#107C10',
    aliases: ['xbox game pass', 'game pass'],
  },
  {
    name: 'Nintendo Switch Online',
    category: 'games',
    color: '#E60012',
    aliases: ['nintendo switch online'],
  },
  { name: 'Steam', category: 'games', color: '#1B2838', aliases: ['steam'] },
  { name: 'EA Play', category: 'games', color: '#FF4747', aliases: ['ea play'] },

  { name: 'Gym Pass', category: 'fitness', color: '#DCB85C', aliases: ['gym pass', 'gympass'] },
  {
    name: 'Sport Life',
    category: 'fitness',
    color: '#DCB85C',
    aliases: ['sport life', 'sportlife'],
  },
  { name: 'Strava', category: 'fitness', color: '#FC4C02', aliases: ['strava'] },
];

export const findMerchant = (rawText: string): MerchantCatalogEntry | undefined => {
  const normalized = rawText.toLowerCase();
  return merchantCatalog.find((entry) => entry.aliases.some((alias) => normalized.includes(alias)));
};
