import { Category } from '@/types/category.types';

export type CurrencyCode = 'UAH' | 'USD' | 'EUR';

export type BillingCycle = 'weekly' | 'monthly' | 'yearly' | 'once';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';

export type SubscriptionSource = 'manual' | 'app_store_screenshot' | 'receipt';

export type Subscription = {
  id: string;
  name: string;
  category: Category;
  /** З merchants.catalog.ts або AI-розпізнавання фото — null, якщо жодне не впевнене. */
  domain: string | null;
  /** Пряме посилання на керування/скасування підписки в мерчанта — null, якщо
   *  невідоме (SubscriptionDetail тоді падає на системний екран Apple). */
  cancelUrl: string | null;
  status: SubscriptionStatus;
  source: SubscriptionSource;
  amount: number;
  currency: CurrencyCode;
  /** Курс до базової валюти (UAH) на дату останнього відомого платежу — SPEC §4. */
  fxRate: number;
  cycle: BillingCycle;
  nextChargeAt: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: CurrencyCode;
  fxRate: number;
  chargedAt: string;
};
