import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type PrimaryButtonProps = { label: string; onPress: () => void };

export const PrimaryButton = ({ label, onPress }: PrimaryButtonProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={[colors.accent, colors.accent2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.btn}
      >
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    btn: {
      borderRadius: uScale(100),
      paddingVertical: uScale(17),
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      color: colors.text,
      fontFamily: fontFamilies.bold,
      fontSize: uFont(16),
    },
  });
