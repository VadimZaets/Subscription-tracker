import { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type LoaderProps = { size?: number; color?: string; style?: ViewStyle };

/**
 * Чотириточковий спінер: 4 точки по кутах квадрата, який крутиться на 180° в
 * нескінченному циклі — завдяки симетрії точок обертання виглядає безшовним
 * (той самий трюк, що й в оригінальному CSS-варіанті на 4 radial-gradient).
 */
export const Loader = ({ size = 20, color = '#fff', style }: LoaderProps) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(180, { duration: 1000, easing: Easing.linear }), -1);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const dotSize = size * 0.24;
  const dotStyle = {
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: color,
  };

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle, style]}>
      <View style={[styles.dot, dotStyle, { top: 0, left: size / 2 - dotSize / 2 }]} />
      <View style={[styles.dot, dotStyle, { bottom: 0, left: size / 2 - dotSize / 2 }]} />
      <View style={[styles.dot, dotStyle, { left: 0, top: size / 2 - dotSize / 2 }]} />
      <View style={[styles.dot, dotStyle, { right: 0, top: size / 2 - dotSize / 2 }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  dot: { position: 'absolute' },
});
