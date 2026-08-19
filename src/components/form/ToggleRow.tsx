import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type ToggleRowProps = {
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export const ToggleRow = ({ title, subtitle, value, onChange }: ToggleRowProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable onPress={() => onChange(!value)} style={styles.row}>
      <View style={styles.mid}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.toggle, value ? styles.toggleOn : styles.toggleOff]}>
        <View style={[styles.knob, value ? styles.knobOn : styles.knobOff]} />
      </View>
    </Pressable>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(14),
    },
    mid: { flex: 1 },
    title: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.text },
    subtitle: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(11.5),
      color: colors.textFaint,
      marginTop: uScale(2),
    },
    toggle: {
      width: uScale(40),
      height: uScale(24),
      borderRadius: uScale(12),
      justifyContent: 'center',
    },
    toggleOn: { backgroundColor: colors.accent2 },
    toggleOff: { backgroundColor: colors.glassStrong },
    knob: {
      width: uScale(20),
      height: uScale(20),
      borderRadius: uScale(10),
      backgroundColor: colors.onAccent,
    },
    knobOn: { alignSelf: 'flex-end', marginRight: uScale(2) },
    knobOff: { alignSelf: 'flex-start', marginLeft: uScale(2) },
  });
