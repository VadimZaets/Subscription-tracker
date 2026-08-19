import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';

import * as schema from '@/db/schema';

// enableChangeListener — обов'язковий прапорець для реактивності useLiveQuery.
const sqliteDb = openDatabaseSync('snapsy.db', { enableChangeListener: true });

export const db = drizzle(sqliteDb, { schema });
