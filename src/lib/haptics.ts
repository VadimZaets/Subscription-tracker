import * as ExpoHaptics from 'expo-haptics';

/** Один виклик на будь-яку тактильну подію в застосунку — щоб не тягнути
 *  `expo-haptics` і не пам'ятати Impact/Notification API в кожному компоненті. */
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

export const haptics = (type: HapticType): void => {
  switch (type) {
    case 'light':
      ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light);
      return;
    case 'medium':
      ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
      return;
    case 'heavy':
      ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Heavy);
      return;
    case 'success':
      ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Success);
      return;
    case 'warning':
      ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Warning);
      return;
    case 'error':
      ExpoHaptics.notificationAsync(ExpoHaptics.NotificationFeedbackType.Error);
      return;
  }
};
