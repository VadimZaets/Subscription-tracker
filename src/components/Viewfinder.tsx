import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type ViewfinderProps = {
  label: string;
  amount: string;
  sub: string;
  nextChargeName: string;
  nextChargeWhen: string;
};

export const Viewfinder = ({
  label,
  amount,
  sub,
  nextChargeName,
  nextChargeWhen,
}: ViewfinderProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.frame}>
      <View style={[styles.corner, styles.cornerTL]} />
      <View style={[styles.corner, styles.cornerTR]} />
      <View style={[styles.corner, styles.cornerBL]} />
      <View style={[styles.corner, styles.cornerBR]} />

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.amount}>{amount}</Text>
      <Text style={styles.sub}>{sub}</Text>

      <View style={styles.nextPill}>
        <Ionicons name="time-outline" size={uScale(13)} color={colors.textDim} />
        <Text style={styles.nextText}>
          <Text style={styles.nextName}>{nextChargeName}</Text> — {nextChargeWhen}
        </Text>
      </View>
    </View>
  );
};

const CORNER_SIZE = 22;
const CORNER_WIDTH = 2.5;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    frame: {
      alignItems: 'center',
      paddingVertical: uScale(34),
      paddingHorizontal: uScale(26),
      marginTop: uScale(6),
      marginBottom: uScale(30),
    },
    corner: { position: 'absolute', width: uScale(CORNER_SIZE), height: uScale(CORNER_SIZE) },
    cornerTL: {
      top: 0,
      left: 0,
      borderTopWidth: CORNER_WIDTH,
      borderLeftWidth: CORNER_WIDTH,
      borderColor: colors.accent2,
      borderTopLeftRadius: uScale(8),
    },
    cornerTR: {
      top: 0,
      right: 0,
      borderTopWidth: CORNER_WIDTH,
      borderRightWidth: CORNER_WIDTH,
      borderColor: colors.accent2,
      borderTopRightRadius: uScale(8),
    },
    cornerBL: {
      bottom: 0,
      left: 0,
      borderBottomWidth: CORNER_WIDTH,
      borderLeftWidth: CORNER_WIDTH,
      borderColor: colors.accent2,
      borderBottomLeftRadius: uScale(8),
    },
    cornerBR: {
      bottom: 0,
      right: 0,
      borderBottomWidth: CORNER_WIDTH,
      borderRightWidth: CORNER_WIDTH,
      borderColor: colors.accent2,
      borderBottomRightRadius: uScale(8),
    },
    label: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10.5),
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: colors.textFaint,
    },
    amount: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(38),
      color: colors.text,
      marginTop: uScale(10),
    },
    sub: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(13),
      color: colors.textDim,
      marginTop: uScale(6),
    },
    nextPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(7),
      marginTop: uScale(16),
      paddingHorizontal: uScale(14),
      paddingVertical: uScale(8),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(100),
    },
    nextText: { fontFamily: fontFamilies.semiBold, fontSize: uFont(12), color: colors.textDim },
    nextName: { fontFamily: fontFamilies.extraBold, color: colors.text },
  });
