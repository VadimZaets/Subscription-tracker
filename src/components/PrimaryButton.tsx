import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Loader } from '@/components/ui/Loader';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  loadingLabel?: string;
};

export const PrimaryButton = ({
  label,
  onPress,
  loading = false,
  loadingLabel,
}: PrimaryButtonProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable onPress={loading ? undefined : onPress} disabled={loading}>
      <LinearGradient
        colors={[colors.accent, colors.accent2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.btn, loading && styles.btnLoading]}
      >
        {loading ? (
          <View style={styles.loadingRow}>
            <Loader size={uScale(18)} color={colors.onAccent} />
            {loadingLabel ? <Text style={styles.label}>{loadingLabel}</Text> : null}
          </View>
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
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
    btnLoading: { opacity: 0.85 },
    loadingRow: { flexDirection: 'row', alignItems: 'center', gap: uScale(10) },
    label: {
      color: colors.text,
      fontFamily: fontFamilies.bold,
      fontSize: uFont(16),
    },
  });
