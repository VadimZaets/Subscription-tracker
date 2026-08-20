import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useCallback, useState } from 'react';

import { AddActionOverlay } from '@/components/AddActionOverlay';
import { SnapsyTabBar } from '@/components/SnapsyTabBar';
import { Home } from '@/screens/Home';
import { Settings } from '@/screens/Settings';

import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

/** Порожній екран — тап на нього перехоплюється кастомним таб-баром
 *  (`SnapsyTabBar`), який відкриває `AddActionOverlay` замість навігації. */
const AddActionPlaceholder = () => null;

export const TabNavigator = () => {
  const [actionOpen, setActionOpen] = useState(false);

  const handleToggleAction = useCallback(() => setActionOpen((open) => !open), []);
  const handleCloseAction = useCallback(() => setActionOpen(false), []);

  return (
    <Tab.Navigator
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
      <Tab.Screen name="home" component={Home} options={{ title: 'Дім' }} />
      <Tab.Screen name="add-action" component={AddActionPlaceholder} options={{ title: '' }} />
      <Tab.Screen name="settings" component={Settings} options={{ title: 'Налашт.' }} />
    </Tab.Navigator>
  );
};
