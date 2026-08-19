import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

export type ChipOption<T extends string> = { key: T; label: string };

type ChipGroupProps<T extends string> = {
  label: string;
  options: ChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const ChipGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
}: ChipGroupProps<T>) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chips}>
        {options.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[styles.chip, value === option.key && styles.chipOn]}
          >
            <Text style={[styles.chipText, value === option.key && styles.chipTextOn]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    block: { marginBottom: uScale(22) },
    label: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
      marginBottom: uScale(8),
    },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: uScale(8) },
    chip: {
      paddingHorizontal: uScale(14),
      paddingVertical: uScale(9),
      borderRadius: uScale(100),
      borderWidth: 1,
      borderColor: colors.borderGlass,
      backgroundColor: colors.glass,
    },
    chipOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    chipText: { fontFamily: fontFamilies.bold, fontSize: uFont(13), color: colors.textDim },
    chipTextOn: { color: colors.onAccent },
  });
