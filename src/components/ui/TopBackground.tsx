import { Canvas, Fill, RadialGradient, vec } from '@shopify/react-native-skia';
import { StyleSheet, useWindowDimensions } from 'react-native';

import { useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';

export type TopBackgroundOrigin = 'top' | 'topLeft' | 'topRight';

const ORIGIN_X_FACTOR: Record<TopBackgroundOrigin, number> = {
  top: 0.5,
  topLeft: 0,
  topRight: 1,
};

type TopBackgroundProps = {
  /** Звідки "світить" центр градієнта — за замовчуванням прямо згори. */
  origin?: TopBackgroundOrigin;
  /** Колір градієнта — за замовчуванням акцентний з теми. SubscriptionDetail
   *  передає сюди categoryColor мерчанта (той самий, що й на MerchantLogo/
   *  CategoryBadge), щоб фон підлаштовувався під бренд відкритої підписки. */
  tint?: string;
};

/** Радіальний градієнт, що "світить" згори екрана — фон для кожного екрана,
 *  як на макеті. Canvas на весь екран, colors.bg суцільним шаром знизу, зверху
 *  — радіальний градієнт з центром за верхнім краєм. */
export const TopBackground = ({ origin = 'top', tint }: TopBackgroundProps) => {
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const gradientColor = tint ?? colors.accent;

  return (
    <Canvas
      pointerEvents="none"
      style={[styles.container, { width, height }]}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Fill color={colors.bg} />

      <Fill>
        <RadialGradient
          c={vec(width * ORIGIN_X_FACTOR[origin], -uScale(60))}
          r={width * 0.5}
          colors={[`${gradientColor}99`, `${gradientColor}4D`, `${gradientColor}00`]}
          positions={[0, 0.4, 1]}
        />
      </Fill>
    </Canvas>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
});
