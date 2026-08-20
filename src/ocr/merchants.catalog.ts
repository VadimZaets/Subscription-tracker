import { Category } from '@/types/category.types';

export type MerchantCatalogEntry = {
  name: string;
  category: Category;
  color: string;
  /** Малими літерами, без діакритики — з чим звіряємо розпізнаний текст. */
  aliases: string[];
  /** Для Logo.dev (src/components/MerchantLogo.tsx). Немає домену — падаємо на CategoryBadge. */
  domain?: string;
};

// Топ-50 мерчантів: один словник обслуговує матчинг у OCR, дефолтну категорію
// і брендовий колір рядка таймлайну (замість трьох окремих механізмів).
export const merchantCatalog: MerchantCatalogEntry[] = [
  {
    name: 'Netflix',
    category: 'streaming',
    color: '#E44830',
    aliases: ['netflix'],
    domain: 'netflix.com',
  },
  {
    name: 'YouTube Premium',
    category: 'streaming',
    color: '#FD402C',
    aliases: ['youtube premium', 'youtube'],
    domain: 'youtube.com',
  },
  {
    name: 'Spotify',
    category: 'streaming',
    color: '#1DB954',
    aliases: ['spotify'],
    domain: 'spotify.com',
  },
  {
    name: 'Apple Music',
    category: 'streaming',
    color: '#FA233B',
    aliases: ['apple music'],
    domain: 'apple.com',
  },
  {
    name: 'Apple TV+',
    category: 'streaming',
    color: '#000000',
    aliases: ['apple tv'],
    domain: 'apple.com',
  },
  {
    name: 'Disney+',
    category: 'streaming',
    color: '#113CCF',
    aliases: ['disney+', 'disney plus'],
    domain: 'disneyplus.com',
  },
  {
    name: 'HBO Max',
    category: 'streaming',
    color: '#8B5CF6',
    aliases: ['hbo max', 'max.com'],
    domain: 'max.com',
  },
  {
    name: 'Amazon Prime Video',
    category: 'streaming',
    color: '#00A8E1',
    aliases: ['prime video', 'amazon prime'],
    domain: 'primevideo.com',
  },
  {
    name: 'Twitch',
    category: 'streaming',
    color: '#9146FF',
    aliases: ['twitch'],
    domain: 'twitch.tv',
  },
  {
    name: 'SoundCloud',
    category: 'streaming',
    color: '#FF5500',
    aliases: ['soundcloud'],
    domain: 'soundcloud.com',
  },
  {
    name: 'Megogo',
    category: 'streaming',
    color: '#00C2FF',
    aliases: ['megogo'],
    domain: 'megogo.net',
  },
  {
    name: 'Sweet.tv',
    category: 'streaming',
    color: '#FF6A00',
    aliases: ['sweet.tv', 'sweet tv'],
    domain: 'sweet.tv',
  },
  {
    name: 'Kyivstar TV',
    category: 'streaming',
    color: '#FFD100',
    aliases: ['kyivstar tv'],
    domain: 'kyivstar.ua',
  },

  {
    name: 'iCloud+',
    category: 'cloud',
    color: '#3ED598',
    aliases: ['icloud'],
    domain: 'apple.com',
  },
  {
    name: 'Google One',
    category: 'cloud',
    color: '#4285F4',
    aliases: ['google one', 'google storage'],
    domain: 'google.com',
  },
  {
    name: 'Dropbox',
    category: 'cloud',
    color: '#0061FF',
    aliases: ['dropbox'],
    domain: 'dropbox.com',
  },
  {
    name: 'Microsoft 365',
    category: 'cloud',
    color: '#EB3C00',
    aliases: ['microsoft 365', 'office 365'],
    domain: 'microsoft.com',
  },

  {
    name: 'Notion',
    category: 'software',
    color: '#000000',
    aliases: ['notion'],
    domain: 'notion.so',
  },
  {
    name: 'Figma',
    category: 'software',
    color: '#F24E1E',
    aliases: ['figma'],
    domain: 'figma.com',
  },
  {
    name: 'Adobe Creative Cloud',
    category: 'software',
    color: '#FF0000',
    aliases: ['adobe'],
    domain: 'adobe.com',
  },
  {
    name: 'Canva',
    category: 'software',
    color: '#00C4CC',
    aliases: ['canva'],
    domain: 'canva.com',
  },
  {
    name: 'ChatGPT Plus',
    category: 'software',
    color: '#10A37F',
    aliases: ['chatgpt', 'openai'],
    domain: 'openai.com',
  },
  {
    name: 'Claude Pro',
    category: 'software',
    color: '#D97757',
    aliases: ['claude.ai', 'anthropic'],
    domain: 'anthropic.com',
  },
  {
    name: 'GitHub',
    category: 'software',
    color: '#181717',
    aliases: ['github'],
    domain: 'github.com',
  },
  {
    name: 'Grammarly',
    category: 'software',
    color: '#15C39A',
    aliases: ['grammarly'],
    domain: 'grammarly.com',
  },
  {
    name: '1Password',
    category: 'software',
    color: '#1A285F',
    aliases: ['1password'],
    domain: '1password.com',
  },
  {
    name: 'NordVPN',
    category: 'software',
    color: '#4687FF',
    aliases: ['nordvpn'],
    domain: 'nordvpn.com',
  },
  {
    name: 'LinkedIn Premium',
    category: 'software',
    color: '#0A66C2',
    aliases: ['linkedin'],
    domain: 'linkedin.com',
  },
  {
    name: 'Duolingo',
    category: 'software',
    color: '#58CC02',
    aliases: ['duolingo'],
    domain: 'duolingo.com',
  },

  {
    name: 'Discord Nitro',
    category: 'games',
    color: '#9146FF',
    aliases: ['discord nitro', 'discord'],
    domain: 'discord.com',
  },
  {
    name: 'PlayStation Plus',
    category: 'games',
    color: '#0070D1',
    aliases: ['playstation plus', 'psn'],
    domain: 'playstation.com',
  },
  {
    name: 'Xbox Game Pass',
    category: 'games',
    color: '#107C10',
    aliases: ['xbox game pass', 'game pass'],
    domain: 'xbox.com',
  },
  {
    name: 'Nintendo Switch Online',
    category: 'games',
    color: '#E60012',
    aliases: ['nintendo switch online'],
    domain: 'nintendo.com',
  },
  {
    name: 'Steam',
    category: 'games',
    color: '#1B2838',
    aliases: ['steam'],
    domain: 'steampowered.com',
  },
  {
    name: 'EA Play',
    category: 'games',
    color: '#FF4747',
    aliases: ['ea play'],
    domain: 'ea.com',
  },

  {
    name: 'Getcontact',
    category: 'software',
    color: '#5B7FFF',
    aliases: ['getcontact'],
    domain: 'getcontact.com',
  },
  {
    name: 'RNI Films',
    category: 'software',
    color: '#D4A15C',
    aliases: ['rni films', 'rni pro', 'rni'],
    domain: 'reallyniceimages.com',
  },

  { name: 'Gym Pass', category: 'fitness', color: '#DCB85C', aliases: ['gym pass', 'gympass'] },
  {
    name: 'Sport Life',
    category: 'fitness',
    color: '#DCB85C',
    aliases: ['sport life', 'sportlife'],
  },
  {
    name: 'Strava',
    category: 'fitness',
    color: '#FC4C02',
    aliases: ['strava'],
    domain: 'strava.com',
  },
];

export const findMerchant = (rawText: string): MerchantCatalogEntry | undefined => {
  const normalized = rawText.toLowerCase();
  return merchantCatalog.find((entry) => entry.aliases.some((alias) => normalized.includes(alias)));
};
