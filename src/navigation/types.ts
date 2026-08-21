import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type TabParamList = {
  home: undefined;
  'add-action': undefined;
  settings: undefined;
};

export type RootStackParamList = {
  Splash: undefined;
  Tabs: undefined;
  Add: undefined;
  Confirm: { uri?: string; source?: 'camera' | 'gallery' } | undefined;
  SubscriptionDetail: { id: string };
  Paywall: undefined;
  DevOcrSpike: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type TabScreenProps<Screen extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
