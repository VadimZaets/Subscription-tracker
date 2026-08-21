import { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { TopBackground, TopBackgroundOrigin } from '@/components/ui/TopBackground';
import { ThemeColors, useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';

/** Горизонтальний відступ екрана. Екрани зі ScrollView кладуть його у
 *  contentContainerStyle (а не на контейнер), щоб скролбар лишався біля краю. */
export const SCREEN_PADDING_H = 20;

type ScreenProps = PropsWithChildren<{
  style?: ViewStyle;
  /** false — контейнер без горизонтальних паддінгів (для повноширинного ScrollView). */
  padded?: boolean;
  edges?: readonly Edge[];
  /** Звідки "світить" фоновий градієнт — за замовчуванням прямо згори. */
  gradientOrigin?: TopBackgroundOrigin;
  /** Колір градієнта — за замовчуванням акцентний з теми. */
  gradientTint?: string;
}>;

const DEFAULT_EDGES: readonly Edge[] = ['top', 'bottom'];

export const Screen = ({
  children,
  style,
  padded = true,
  edges = DEFAULT_EDGES,
  gradientOrigin,
  gradientTint,
}: ScreenProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <>
      <TopBackground origin={gradientOrigin} tint={gradientTint} />
      <SafeAreaView style={styles.safe} edges={edges}>
        <View style={[styles.container, padded && styles.padded, style]}>{children}</View>
      </SafeAreaView>
    </>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.transparent },
    container: { flex: 1, backgroundColor: colors.transparent },
    padded: { paddingHorizontal: uScale(SCREEN_PADDING_H) },
  });
