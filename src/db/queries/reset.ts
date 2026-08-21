import { sql } from 'drizzle-orm';

import { db } from '@/db/client';
import { documents, payments, subscriptions } from '@/db/schema';

/** Порядок видалення враховує FK (payments/documents можуть посилатись на subscriptions).
 *  `.where(sql\`1=1\`)` — не косметика: без WHERE SQLite виконує unconditional
 *  DELETE через "truncate optimization" і мовчки НЕ викликає update_hook, на
 *  якому тримається реактивність useLiveQuery — Home лишався б зі старими
 *  рядками аж до перезапуску застосунку. Будь-який WHERE вимикає цю оптимізацію. */
export const resetDatabase = async (): Promise<void> => {
  await db.delete(payments).where(sql`1=1`);
  await db.delete(documents).where(sql`1=1`);
  await db.delete(subscriptions).where(sql`1=1`);
};
