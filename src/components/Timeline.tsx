import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

import { SPINE_LEFT, SPINE_WIDTH, TIMELINE_PADDING_LEFT } from '@/components/timeline.constants';
import { useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';

export const Timeline = ({ children }: PropsWithChildren) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={[colors.accent2, colors.transparent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.spine}
      />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { paddingLeft: uScale(TIMELINE_PADDING_LEFT) },
  spine: {
    position: 'absolute',
    left: uScale(SPINE_LEFT),
    top: uScale(6),
    bottom: uScale(14),
    width: SPINE_WIDTH,
  },
});
