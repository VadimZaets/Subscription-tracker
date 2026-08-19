import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { PropsWithChildren, useEffect } from 'react';
import { Text } from 'react-native';

import { db } from '@/db/client';
import migrations from '@/db/migrations/migrations';

type DatabaseProviderProps = PropsWithChildren<{
  onReady: () => void;
}>;

/** Тримає дерево незмонтованим, поки міграції не завершились — `onReady` каже
 *  _layout.tsx, що можна об'єднати цей гейт із гейтом шрифтів і ховати splash. */
export const DatabaseProvider = ({ children, onReady }: DatabaseProviderProps) => {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (success) onReady();
  }, [success, onReady]);

  if (error) {
    return <Text>{`DB migration failed: ${error.message}`}</Text>;
  }

  if (!success) {
    return null;
  }

  return <>{children}</>;
};
