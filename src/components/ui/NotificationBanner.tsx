import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type NotificationData = {
  id: string;
  type: NotificationType;
  message: string;
  visible: boolean;
};

type NotificationBannerProps = {
  notification: NotificationData | null;
  onRequestClose: () => void;
  onHidden: () => void;
};

const TYPE_META: Record<
  NotificationType,
  { icon: keyof typeof Ionicons.glyphMap; colorKey: 'good' | 'accent2' | 'gold' | 'red' }
> = {
  success: { icon: 'checkmark-circle', colorKey: 'good' },
  info: { icon: 'information-circle', colorKey: 'accent2' },
  warning: { icon: 'warning', colorKey: 'gold' },
  error: { icon: 'close-circle', colorKey: 'red' },
};

const HIDDEN_OFFSET = -140;

/** Банер-нотифікація зверху екрана — той самий підхід, що й у vizitka_rn
 *  (спрінг у появі, timing на зникнення), але в стилі застосунку: скляна
 *  картка (glassStrong/borderGlass) з кольоровим акцентом типу події, а не
 *  суцільна заливка. Керується через NotificationContext/useNotification. */
export const NotificationBanner = ({
  notification,
  onRequestClose,
  onHidden,
}: NotificationBannerProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const [measuredHeight, setMeasuredHeight] = useState(uScale(64));
  const translateY = useSharedValue(HIDDEN_OFFSET);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!notification) return;
    const hiddenY = -(measuredHeight + uScale(12));

    if (notification.visible) {
      translateY.value = hiddenY;
      opacity.value = 0;
      translateY.value = withSpring(0, { damping: 18, stiffness: 190, mass: 1 });
      opacity.value = withTiming(1, { duration: 180 });
    } else {
      translateY.value = withTiming(hiddenY, { duration: 220, easing: Easing.in(Easing.cubic) });
      opacity.value = withTiming(0, { duration: 160 }, (finished) => {
        // withTiming-колбек виконується на UI-потоці (worklet) — прямий виклик
        // звичайної JS-функції звідти кидає "Tried to synchronously call a
        // Remote Function", потрібен runOnJS.
        if (finished) runOnJS(onHidden)();
      });
    }
  }, [notification, measuredHeight, onHidden, opacity, translateY]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    if (h > 0 && Math.abs(h - measuredHeight) > 1) setMeasuredHeight(h);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!notification) return null;

  const meta = TYPE_META[notification.type];
  const tint = colors[meta.colorKey];

  return (
    // Modal — свідомо: він рендериться в окреме нативне вікно над УСІМ, зокрема
    // над Skia Canvas (TopBackground) та headers екранів. Ні zIndex, ні порядок
    // JSX не гарантують перекриття нативного Canvas-шару — Modal гарантує.
    <Modal visible transparent animationType="none" statusBarTranslucent>
      <View
        pointerEvents={notification.visible ? 'box-none' : 'none'}
        style={[styles.host, { top: insets.top + uScale(10) }]}
      >
        <Animated.View
          onLayout={handleLayout}
          style={[styles.card, { borderColor: `${tint}40` }, animatedStyle]}
        >
          <View style={[styles.iconWrap, { backgroundColor: `${tint}24` }]}>
            <Ionicons name={meta.icon} size={uScale(17)} color={tint} />
          </View>

          <Text style={styles.message}>{notification.message}</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={strings.common.close}
            onPress={onRequestClose}
            hitSlop={10}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={uScale(16)} color={colors.textFaint} />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    host: {
      position: 'absolute',
      left: uScale(16),
      right: uScale(16),
      zIndex: 999,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(10),
      borderRadius: uScale(16),
      paddingVertical: uScale(10),
      paddingHorizontal: uScale(10),
      // Повністю непрозорий навмисно — банер у Modal-вікні над усім екраном,
      // і крізь напівпрозору картку інакше просвічував би текст заголовка
      // позаду, роблячи повідомлення нечитабельним.
      backgroundColor: '#121218',
      borderWidth: 1,
      shadowColor: '#000',
      shadowOpacity: 0.25,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 8 },
      elevation: 8,
    },
    iconWrap: {
      width: uScale(32),
      height: uScale(32),
      borderRadius: uScale(10),
      alignItems: 'center',
      justifyContent: 'center',
    },
    message: {
      flex: 1,
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(13),
      lineHeight: uFont(18),
      color: colors.text,
    },
    closeBtn: {
      width: uScale(28),
      height: uScale(28),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: uScale(14),
    },
  });
