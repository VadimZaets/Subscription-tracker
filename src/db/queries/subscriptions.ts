import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { subscriptions } from '@/db/schema';
import { computeNextChargeAt } from '@/lib/billing/nextCharge';
import { toLocalIsoDate } from '@/lib/format/date';
import { generateId } from '@/lib/id';
import { Category } from '@/types/category.types';
import {
  BillingCycle,
  CurrencyCode,
  SubscriptionSource,
  SubscriptionStatus,
} from '@/types/subscription.types';

export const listSubscriptions = () => db.select().from(subscriptions);

export const getSubscriptionById = (id: string) =>
  db.select().from(subscriptions).where(eq(subscriptions.id, id));

export const updateSubscriptionStatus = (id: string, status: SubscriptionStatus) =>
  db.update(subscriptions).set({ status }).where(eq(subscriptions.id, id));

export type NewSubscriptionInput = {
  name: string;
  category: Category;
  domain?: string | null;
  amount: number;
  currency: CurrencyCode;
  cycle: BillingCycle;
  firstChargeAt: Date;
  source?: SubscriptionSource;
};

/** `fxRate` фіксується на 1, бо MVP поки не має живого курсу — мультивалютність
 *  готова на рівні схеми (SPEC §4), сам конвертер приходить пізніше. */
export const createSubscription = (input: NewSubscriptionInput, now: Date) => {
  const nextChargeAt = computeNextChargeAt(input.firstChargeAt, input.cycle, now);

  return db.insert(subscriptions).values({
    id: generateId(),
    name: input.name,
    category: input.category,
    domain: input.domain ?? null,
    amount: input.amount,
    currency: input.currency,
    fxRate: 1,
    cycle: input.cycle,
    nextChargeAt: toLocalIsoDate(nextChargeAt),
    status: 'active',
    source: input.source ?? 'manual',
    createdAt: now.toISOString(),
  });
};
