import { db } from '@/db/client';
import { documents, payments, subscriptions } from '@/db/schema';

/** Порядок видалення враховує FK (payments/documents можуть посилатись на subscriptions). */
export const resetDatabase = async (): Promise<void> => {
  await db.delete(payments);
  await db.delete(documents);
  await db.delete(subscriptions);
};
