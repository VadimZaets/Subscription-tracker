import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { FC, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';

import HomeIcon from '@/assets/icon/tabBar/home.svg';
import PlusIcon from '@/assets/icon/tabBar/plus.svg';
import SettingsIcon from '@/assets/icon/tabBar/settings.svg';
import { TAB_BAR_BOTTOM, TAB_BAR_HEIGHT, TAB_BAR_INSET_H } from '@/components/tabBar.constants';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';

const ADD_ROUTE = 'add-action';
const TRANSITION_MS = 220;

const TAB_ICONS: Record<string, FC<SvgProps>> = {
  home: HomeIcon,
  settings: SettingsIcon,
};

type SnapsyTabBarProps = BottomTabBarProps & {
  actionOpen: boolean;
  onToggleAction: () => void;
};

/** Коли меню дій відкрите, від бара лишається тільки бульбашка «+»: капсула-фон і
 *  таби Дім/Налаштування зникають, а сама бульбашка розгортається в «×». Весь бар
 *  тут власний (не дефолтний react-navigation) — щоб керувати цим напряму стилями. */
export const SnapsyTabBar = ({
  state,
  descriptors,
  navigation,
  actionOpen,
  onToggleAction,
}: SnapsyTabBarProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: withTiming(actionOpen ? 0 : 1, { duration: TRANSITION_MS }),
  }));
  const sideItemsStyle = useAnimatedStyle(() => ({
    opacity: withTiming(actionOpen ? 0 : 1, { duration: TRANSITION_MS }),
  }));
  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(actionOpen ? '45deg' : '0deg', { duration: TRANSITION_MS }) }],
  }));
  const gradientStyle = useAnimatedStyle(() => ({
    opacity: withTiming(actionOpen ? 0 : 1, { duration: TRANSITION_MS }),
  }));
  const closedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(actionOpen ? 1 : 0, { duration: TRANSITION_MS }),
  }));

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <Animated.View style={[styles.pill, pillStyle]} pointerEvents="none" />

      <View style={styles.itemsRow}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          if (route.name === ADD_ROUTE) {
            return (
              <Pressable key={route.key} onPress={onToggleAction} style={styles.item}>
                <View style={styles.bubble}>
                  <Animated.View style={[StyleSheet.absoluteFill, gradientStyle]}>
                    <LinearGradient
                      colors={[colors.accent, colors.accent2]}
                      style={styles.bubbleFace}
                    />
                  </Animated.View>
                  <Animated.View
                    style={[StyleSheet.absoluteFill, styles.bubbleClosedFace, closedStyle]}
                  />
                  <Animated.View style={plusStyle}>
                    <PlusIcon width={uScale(18)} height={uScale(18)} color={colors.onAccent} />
                  </Animated.View>
                </View>
              </Pressable>
            );
          }

          const handlePress = () => {
            if (actionOpen) onToggleAction();

            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };

          const TabIcon = TAB_ICONS[route.name];

          return (
            <Animated.View key={route.key} style={[styles.item, sideItemsStyle]}>
              <Pressable onPress={handlePress} disabled={actionOpen} style={styles.itemPressable}>
                {TabIcon ? (
                  <TabIcon
                    width={uScale(18)}
                    height={uScale(18)}
                    color={focused ? colors.text : colors.textFaint}
                  />
                ) : null}
                <Text style={[styles.label, focused ? styles.labelOn : styles.labelOff]}>
                  {descriptors[route.key].options.title ?? route.name}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: {
      position: 'absolute',
      left: uScale(TAB_BAR_INSET_H),
      right: uScale(TAB_BAR_INSET_H),
      bottom: uScale(TAB_BAR_BOTTOM),
      height: uScale(TAB_BAR_HEIGHT),
    },
    pill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: uScale(100),
      backgroundColor: colors.tabBarBg,
      borderWidth: 1,
      borderColor: colors.borderGlass,
    },
    itemsRow: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: uScale(10),
    },
    item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    itemPressable: { alignItems: 'center', justifyContent: 'center' },
    label: { fontFamily: fontFamilies.bold, fontSize: uScale(10), marginTop: uScale(2) },
    labelOn: { color: colors.text },
    labelOff: { color: colors.textFaint },
    bubble: {
      width: uScale(52),
      height: uScale(52),
      borderRadius: uScale(26),
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ translateY: uScale(-14) }],
      overflow: 'hidden',
    },
    bubbleFace: { flex: 1 },
    bubbleClosedFace: {
      borderRadius: uScale(26),
      backgroundColor: colors.glassStrong,
      borderWidth: 1,
      borderColor: colors.borderGlass,
    },
  });
