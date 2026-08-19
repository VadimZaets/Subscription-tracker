import { PropsWithChildren, useMemo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { ThemeColors, useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';

type GlassCardProps = PropsWithChildren<{ style?: ViewStyle }>;

export const GlassCard = ({ children, style }: GlassCardProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return <View style={[styles.card, style]}>{children}</View>;
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(16),
    },
  });
