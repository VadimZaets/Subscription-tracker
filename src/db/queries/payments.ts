import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { payments } from '@/db/schema';

// Запис у payments з'являється в Кроці 8 (чеки) — поки що список завжди порожній
// для підписок, доданих вручну, і це коректно відображає реальність.
export const listPaymentsForSubscription = (subscriptionId: string) =>
  db
    .select()
    .from(payments)
    .where(eq(payments.subscriptionId, subscriptionId))
    .orderBy(desc(payments.chargedAt));
