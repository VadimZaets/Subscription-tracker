import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { subscriptions } from '@/db/schema';
import { computeNextChargeAt } from '@/lib/billing/nextCharge';
import { toLocalIsoDate } from '@/lib/format/date';
import { generateId } from '@/lib/id';
import { Category } from '@/types/category.types';
import { BillingCycle, CurrencyCode, SubscriptionSource } from '@/types/subscription.types';

export const listSubscriptions = () => db.select().from(subscriptions);

export const getSubscriptionById = (id: string) =>
  db.select().from(subscriptions).where(eq(subscriptions.id, id));

export const deleteSubscription = (id: string) =>
  db.delete(subscriptions).where(eq(subscriptions.id, id));

/** Дубль — та сама (за назвою, без урахування регістру) активна підписка з
 *  тією самою сумою. Скасовані/на паузі не блокують — людина могла свідомо
 *  прибрати стару й додати актуальну. */
export const findActiveDuplicate = async (name: string, amount: number) => {
  const rows = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(sql`lower(${subscriptions.name})`, name.trim().toLowerCase()),
        eq(subscriptions.amount, amount),
        eq(subscriptions.status, 'active'),
      ),
    );
  return rows[0] ?? null;
};

export type NewSubscriptionInput = {
  name: string;
  category: Category;
  domain?: string | null;
  cancelUrl?: string | null;
  amount: number;
  currency: CurrencyCode;
  /** Курс до UAH на момент додавання (getFxRateToUAH) — заморожується тут,
   *  а не рахується наживо при кожному рендері Hero, SPEC §4. */
  fxRate?: number;
  cycle: BillingCycle;
  firstChargeAt: Date;
  source?: SubscriptionSource;
};

export const createSubscription = (input: NewSubscriptionInput, now: Date) => {
  const nextChargeAt = computeNextChargeAt(input.firstChargeAt, input.cycle, now);

  return db.insert(subscriptions).values({
    id: generateId(),
    name: input.name,
    category: input.category,
    domain: input.domain ?? null,
    cancelUrl: input.cancelUrl ?? null,
    amount: input.amount,
    currency: input.currency,
    fxRate: input.fxRate ?? 1,
    cycle: input.cycle,
    nextChargeAt: toLocalIsoDate(nextChargeAt),
    status: 'active',
    source: input.source ?? 'manual',
    createdAt: now.toISOString(),
  });
};
