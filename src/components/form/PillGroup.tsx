import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

export type PillOption<T extends string> = { key: T; label: string };

type PillGroupProps<T extends string> = {
  label?: string;
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export const PillGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
}: PillGroupProps<T>) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.block}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.pills}>
        {options.map((option) => (
          <Pressable
            key={option.key}
            onPress={() => onChange(option.key)}
            style={[styles.pill, value === option.key && styles.pillOn]}
          >
            <Text style={[styles.pillText, value === option.key && styles.pillTextOn]}>
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
    pills: { flexDirection: 'row', gap: uScale(8) },
    pill: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: uScale(11),
      borderRadius: uScale(10),
      borderWidth: 1,
      borderColor: colors.borderGlass,
      backgroundColor: colors.glass,
    },
    pillOn: { backgroundColor: colors.accent, borderColor: colors.accent },
    pillText: { fontFamily: fontFamilies.bold, fontSize: uFont(12.5), color: colors.textDim },
    pillTextOn: { color: colors.onAccent },
  });
