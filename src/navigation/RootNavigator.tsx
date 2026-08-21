import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Add } from '@/screens/Add';
import { Confirm } from '@/screens/Confirm';
import { OcrSpike } from '@/screens/dev/OcrSpike';
import { News } from '@/screens/News';
import { Paywall } from '@/screens/Paywall';
import { Splash } from '@/screens/Splash';
import { SubscriptionDetail } from '@/screens/SubscriptionDetail';
import { useTheme } from '@/theme';

import { TabNavigator } from './TabNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="Add" component={Add} options={{ animation: 'fade' }} />
      <Stack.Screen name="Confirm" component={Confirm} options={{ animation: 'fade' }} />
      <Stack.Screen
        name="SubscriptionDetail"
        component={SubscriptionDetail}
        options={{ animation: 'fade' }}
      />
      <Stack.Screen name="News" component={News} options={{ animation: 'fade' }} />
      <Stack.Screen name="Paywall" component={Paywall} />
      {__DEV__ ? <Stack.Screen name="DevOcrSpike" component={OcrSpike} /> : null}
    </Stack.Navigator>
  );
};
