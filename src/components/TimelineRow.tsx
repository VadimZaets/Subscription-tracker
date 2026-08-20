import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { MerchantLogo } from '@/components/MerchantLogo';
import {
  CONNECTOR_HEIGHT,
  CONNECTOR_LEFT,
  CONNECTOR_WIDTH,
  DOT_OFFSET_LEFT,
  DOT_SIZE,
} from '@/components/timeline.constants';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { Category } from '@/types/category.types';
import { uFont, uScale } from '@/utils/uScale';

export type TimelineRowProps = {
  date: string;
  when: string;
  name: string;
  category: Category;
  categoryLabel: string;
  categoryColor: string;
  domain?: string | null;
  price: string;
  cycle: string;
  isScanned?: boolean;
  /** Останній рядок не малює риску-конектор від хребта до картки. */
  isLast?: boolean;
};

export const TimelineRow = ({
  date,
  when,
  name,
  category,
  categoryLabel,
  categoryColor,
  domain,
  price,
  cycle,
  isScanned,
  isLast,
}: TimelineRowProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <View style={styles.group}>
      <View style={styles.dot} />
      <View style={styles.dateRow}>
        <Text style={styles.date}>{date}</Text>
        <Text style={styles.when}>{when}</Text>
      </View>

      <View style={styles.cardWrap}>
        {isLast ? null : <View style={styles.connector} />}
        <View style={styles.card}>
          <MerchantLogo domain={domain} category={category} color={categoryColor} size={38} />
          <View style={styles.mid}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>
              {isScanned ? (
                <View style={styles.scanBadge}>
                  <Ionicons name="camera" size={uScale(9)} color={colors.accent2} />
                </View>
              ) : null}
            </View>
            <Text style={styles.category}>{categoryLabel}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.price}>{price}</Text>
            <Text style={styles.cycle}>{cycle}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    group: { marginBottom: uScale(22) },
    dot: {
      position: 'absolute',
      left: uScale(DOT_OFFSET_LEFT),
      top: uScale(1),
      width: uScale(DOT_SIZE),
      height: uScale(DOT_SIZE),
      borderRadius: uScale(DOT_SIZE / 2),
      backgroundColor: colors.accent2,
      borderWidth: 3,
      borderColor: colors.bg,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: uScale(8),
      marginBottom: uScale(10),
    },
    date: { fontFamily: fontFamilies.semiBold, fontSize: uFont(12), color: colors.text },
    when: { fontFamily: fontFamilies.semiBold, fontSize: uFont(11.5), color: colors.textFaint },
    cardWrap: { position: 'relative' },
    connector: {
      position: 'absolute',
      left: uScale(CONNECTOR_LEFT),
      top: '50%',
      width: uScale(CONNECTOR_WIDTH),
      height: CONNECTOR_HEIGHT,
      backgroundColor: colors.borderGlass,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(10),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(14),
      padding: uScale(12),
    },
    mid: { flex: 1, minWidth: 0 },
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: uScale(6) },
    name: { fontFamily: fontFamilies.bold, fontSize: uFont(14), color: colors.text },
    scanBadge: {
      width: uScale(15),
      height: uScale(15),
      borderRadius: uScale(8),
      backgroundColor: colors.glassStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    category: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(11),
      color: colors.textFaint,
      marginTop: uScale(1),
    },
    right: { alignItems: 'flex-end' },
    price: { fontFamily: fontFamilies.bold, fontSize: uFont(14), color: colors.text },
    cycle: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(10.5),
      color: colors.textFaint,
      marginTop: uScale(1),
    },
  });
