import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// SPEC.md §4. Відхилення: `fxRate` є і в subscriptions (для проєкції щомісячного
// підсумку без join'у на payments), і в payments (курс на дату конкретного списання).
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(), // streaming|software|fitness|games|cloud|other
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  fxRate: real('fx_rate').notNull(),
  cycle: text('cycle').notNull(), // weekly|monthly|yearly|once
  nextChargeAt: text('next_charge_at').notNull(),
  status: text('status').notNull(), // active|paused|cancelled
  source: text('source').notNull(), // manual|app_store_screenshot|receipt
  createdAt: text('created_at').notNull(),
});

export const payments = sqliteTable('payments', {
  id: text('id').primaryKey(),
  subscriptionId: text('subscription_id')
    .notNull()
    .references(() => subscriptions.id),
  amount: real('amount').notNull(),
  currency: text('currency').notNull(),
  fxRate: real('fx_rate').notNull(),
  chargedAt: text('charged_at').notNull(),
});

export const documents = sqliteTable('documents', {
  id: text('id').primaryKey(),
  type: text('type').notNull(), // receipt|store_screenshot
  localUri: text('local_uri').notNull(),
  ocrText: text('ocr_text'),
  parsedJson: text('parsed_json'),
  status: text('status').notNull(), // pending|confirmed|rejected
  capturedAt: text('captured_at').notNull(),
});

export type SubscriptionRow = typeof subscriptions.$inferSelect;
export type PaymentRow = typeof payments.$inferSelect;
export type DocumentRow = typeof documents.$inferSelect;
