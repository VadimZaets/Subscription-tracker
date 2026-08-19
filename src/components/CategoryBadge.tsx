import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Category } from '@/types/category.types';
import { uScale } from '@/utils/uScale';

type CategoryBadgeProps = { category: Category; color: string; size?: number };

const ICON_BY_CATEGORY: Record<Category, keyof typeof Ionicons.glyphMap> = {
  streaming: 'play',
  software: 'code-slash-outline',
  fitness: 'barbell-outline',
  games: 'game-controller-outline',
  cloud: 'cloud-outline',
  other: 'ellipsis-horizontal-circle-outline',
};

export const CategoryBadge = ({ category, color, size = 42 }: CategoryBadgeProps) => {
  const styles = useMemo(() => makeStyles(color, size), [color, size]);
  const iconName = ICON_BY_CATEGORY[category];

  return (
    <View style={styles.badge}>
      <Ionicons name={iconName} size={uScale(size * 0.42)} color={color} />
    </View>
  );
};

const makeStyles = (color: string, size: number) =>
  StyleSheet.create({
    badge: {
      width: uScale(size),
      height: uScale(size),
      borderRadius: uScale(size / 2),
      backgroundColor: `${color}29`, // ~16% opacity
      borderWidth: 1.5,
      borderColor: `${color}73`, // ~45% opacity
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
