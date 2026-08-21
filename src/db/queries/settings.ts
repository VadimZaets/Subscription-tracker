import { eq } from 'drizzle-orm';

import { db } from '@/db/client';
import { appSettings } from '@/db/schema';

export const getSetting = async (key: string): Promise<string | null> => {
  const rows = await db.select().from(appSettings).where(eq(appSettings.key, key));
  return rows[0]?.value ?? null;
};

export const setSetting = (key: string, value: string) =>
  db
    .insert(appSettings)
    .values({ key, value })
    .onConflictDoUpdate({ target: appSettings.key, set: { value } });
