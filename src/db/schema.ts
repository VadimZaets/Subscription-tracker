import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import { Category } from '@/types/category.types';
import {
  BillingCycle,
  CurrencyCode,
  SubscriptionSource,
  SubscriptionStatus,
} from '@/types/subscription.types';

// SPEC.md §4. Відхилення: `fxRate` є і в subscriptions (для проєкції щомісячного
// підсумку без join'у на payments), і в payments (курс на дату конкретного списання).
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull().$type<Category>(),
  /** З Supabase-кешу мерчантів (точний матч) або від AI-розпізнавання фото —
   *  null, якщо жоден джерело не було впевнене (MerchantLogo падає на бейдж). */
  domain: text('domain'),
  /** Пряме посилання на керування/скасування підписки в самого мерчанта (не
   *  App Store) — від lookupMerchantInfo (Supabase-кеш або AI). null —
   *  SubscriptionDetail падає на системний екран Apple. */
  cancelUrl: text('cancel_url'),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().$type<CurrencyCode>(),
  fxRate: real('fx_rate').notNull(),
  cycle: text('cycle').notNull().$type<BillingCycle>(),
  nextChargeAt: text('next_charge_at').notNull(),
  status: text('status').notNull().$type<SubscriptionStatus>(),
  source: text('source').notNull().$type<SubscriptionSource>(),
  createdAt: text('created_at').notNull(),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  subscriptionId: text('subscription_id')
    .notNull()
    .references(() => subscriptions.id),
  amount: real('amount').notNull(),
  currency: text('currency').notNull().$type<CurrencyCode>(),
  fxRate: real('fx_rate').notNull(),
  chargedAt: text('charged_at').notNull(),
});

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  type: text('type').notNull().$type<'receipt' | 'store_screenshot'>(),
  localUri: text('local_uri').notNull(),
  ocrText: text('ocr_text'),
  parsedJson: text('parsed_json'),
  status: text('status').notNull().$type<'pending' | 'confirmed' | 'rejected'>(),
  capturedAt: text('captured_at').notNull(),
});

export type SubscriptionRow = typeof subscriptions.$inferSelect;
export type PaymentRow = typeof payments.$inferSelect;
export type DocumentRow = typeof documents.$inferSelect;
