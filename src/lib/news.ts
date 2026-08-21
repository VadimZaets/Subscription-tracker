import { listSubscriptions } from '@/db/queries/subscriptions';
import { Region } from '@/lib/region';
import { supabase } from '@/lib/supabase';

export type MerchantNews = {
  id: string;
  merchantKey: string | null;
  merchantName: string | null;
  direction: 'increase' | 'decrease' | 'promo' | 'other' | null;
  region: string | null;
  summaryUk: string | null;
  sourceUrl: string;
  publishedAt: string | null;
  domain: string | null;
};

const LOOKBACK_DAYS = 30;

const normalize = (name: string): string => name.trim().toLowerCase();

/** Усі релевантні новини за останні LOOKBACK_DAYS — RLS вже обмежує до
 *  is_relevant=true, тож тут просто читаємо все й фільтруємо на клієнті
 *  (регіон + локальні підписки), бо жодного з цього на сервері не видно. */
export const fetchRecentMerchantNews = async (): Promise<MerchantNews[]> => {
  if (!supabase) return [];

  const since = new Date(Date.now() - LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from('merchant_news')
    .select(
      'id, merchant_key, merchant_name, direction, region, summary_uk, source_url, published_at',
    )
    .gte('published_at', since)
    .order('published_at', { ascending: false });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    merchantKey: row.merchant_key,
    merchantName: row.merchant_name,
    direction: row.direction,
    region: row.region,
    summaryUk: row.summary_uk,
    sourceUrl: row.source_url,
    publishedAt: row.published_at,
    domain: null,
  }));
};

/** Резолвить лого через уже наявний Supabase-кеш `merchants` (по merchant_key,
 *  тому самому normalize-ключу) — лише для короткого відфільтрованого списку,
 *  не для всього потоку новин. */
const resolveDomains = async (news: MerchantNews[]): Promise<MerchantNews[]> => {
  if (!supabase || news.length === 0) return news;

  const keys = [
    ...new Set(news.map((item) => item.merchantKey).filter((key): key is string => !!key)),
  ];
  if (keys.length === 0) return news;

  const { data } = await supabase.from('merchants').select('name, domain').in('name', keys);
  const domainByKey = new Map((data ?? []).map((row) => [row.name, row.domain]));

  return news.map((item) => ({
    ...item,
    domain: item.merchantKey ? (domainByKey.get(item.merchantKey) ?? null) : null,
  }));
};

const matchesRegion = (news: MerchantNews, region: Region): boolean =>
  !news.region || news.region === 'global' || news.region === region;

/** Показуємо лише новини про сервіси, якими людина реально користується
 *  (та сама груба нормалізація назви, що вже прийнятна для findActiveDuplicate)
 *  і лише для її регіону. */
export const fetchNewsForUser = async (region: Region): Promise<MerchantNews[]> => {
  const [news, subscriptions] = await Promise.all([fetchRecentMerchantNews(), listSubscriptions()]);
  if (news.length === 0) return [];

  const ownedMerchantKeys = new Set(
    subscriptions.filter((sub) => sub.status === 'active').map((sub) => normalize(sub.name)),
  );

  const filtered = news.filter(
    (item) =>
      matchesRegion(item, region) &&
      item.merchantKey !== null &&
      ownedMerchantKeys.has(item.merchantKey),
  );

  return resolveDomains(filtered);
};
