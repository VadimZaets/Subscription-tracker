import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  Urbanist_900Black,
  useFonts,
} from '@expo-google-fonts/urbanist';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootNavigator } from '@/navigation/RootNavigator';
import { RootStackParamList } from '@/navigation/types';
import { DatabaseProvider } from '@/providers/DatabaseProvider';
import { NotificationProvider } from '@/providers/NotificationProvider';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['snapsy://'],
  config: {
    screens: {
      Splash: '',
      Tabs: { screens: { home: 'home', 'add-action': 'add-action', settings: 'settings' } },
      Add: 'add',
      Confirm: 'confirm',
      SubscriptionDetail: 'subscription/:id',
      Paywall: 'paywall',
      DevOcrSpike: 'dev/ocr',
    },
  },
};

const App = () => {
  const { colors } = useTheme();
  const [dbReady, setDbReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    Urbanist_400Regular,
    Urbanist_500Medium,
    Urbanist_600SemiBold,
    Urbanist_700Bold,
    Urbanist_800ExtraBold,
    Urbanist_900Black,
  });

  const handleDbReady = useCallback(() => setDbReady(true), []);
  const appReady = (fontsLoaded || fontError) && dbReady;

  useEffect(() => {
    if (appReady) SplashScreen.hideAsync();
  }, [appReady]);

  if (!appReady) {
    return <DatabaseProvider onReady={handleDbReady}>{null}</DatabaseProvider>;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <DatabaseProvider onReady={handleDbReady}>
          <NotificationProvider>
            <StatusBar style="light" />
            <NavigationContainer linking={linking}>
              <RootNavigator />
            </NavigationContainer>
          </NotificationProvider>
        </DatabaseProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
