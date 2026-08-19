import { Tabs } from 'expo-router';
import { useCallback, useState } from 'react';

import { AddActionOverlay } from '@/components/AddActionOverlay';
import { SnapsyTabBar } from '@/components/SnapsyTabBar';

const TabsLayout = () => {
  const [actionOpen, setActionOpen] = useState(false);

  const handleToggleAction = useCallback(() => setActionOpen((open) => !open), []);
  const handleCloseAction = useCallback(() => setActionOpen(false), []);

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      // Оверлей іде ПЕРЕД баром у тому самому дереві — тому бар (і кнопка «+»)
      // малюється поверх розмиття, без окремої модалки й без копії кнопки.
      tabBar={(props) => (
        <>
          <AddActionOverlay visible={actionOpen} onClose={handleCloseAction} />
          <SnapsyTabBar {...props} actionOpen={actionOpen} onToggleAction={handleToggleAction} />
        </>
      )}
    >
      <Tabs.Screen name="home" options={{ title: 'Дім' }} />
      <Tabs.Screen name="add-action" options={{ title: '' }} />
      <Tabs.Screen name="settings" options={{ title: 'Налашт.' }} />
    </Tabs>
  );
};

export default TabsLayout;
