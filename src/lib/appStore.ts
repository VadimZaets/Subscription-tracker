import { Linking } from 'react-native';

/** Сторонній застосунок не може скасувати підписку App Store — лише привести
 *  користувача на системний екран. Не працює в Simulator, лише на пристрої. */
export const openSubscriptionSettings = (): Promise<boolean> =>
  Linking.openURL('itms-apps://apps.apple.com/account/subscriptions').then(
    () => true,
    () => false,
  );
