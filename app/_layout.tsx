import {
  Urbanist_400Regular,
  Urbanist_500Medium,
  Urbanist_600SemiBold,
  Urbanist_700Bold,
  Urbanist_800ExtraBold,
  Urbanist_900Black,
  useFonts,
} from '@expo-google-fonts/urbanist';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

import { DatabaseProvider } from '@/providers/DatabaseProvider';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
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
    <DatabaseProvider onReady={handleDbReady}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding/promise" />
        <Stack.Screen name="onboarding/scan" />
        <Stack.Screen name="onboarding/result" />
        <Stack.Screen name="add" options={{ presentation: 'modal' }} />
        <Stack.Screen name="confirm" options={{ presentation: 'modal' }} />
        <Stack.Screen name="subscription/[id]" />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
      </Stack>
    </DatabaseProvider>
  );
};

export default RootLayout;
