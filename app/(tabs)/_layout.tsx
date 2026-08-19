import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Tabs } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uScale } from '@/utils/uScale';

const BAR_HEIGHT = 70;

const TabsLayout = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const handleAddTabPress = useCallback((e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.push('/add');
  }, []);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.bar,
        tabBarItemStyle: styles.item,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarLabelStyle: styles.label,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Дім',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={uScale(20)} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add-action"
        options={{
          title: '',
          tabBarIcon: () => (
            <LinearGradient colors={[colors.accent, colors.accent2]} style={styles.bubble}>
              <Ionicons name="add" size={uScale(22)} color={colors.onAccent} />
            </LinearGradient>
          ),
          tabBarIconStyle: styles.bubbleIcon,
        }}
        listeners={{ tabPress: handleAddTabPress }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Налашт.',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={uScale(20)} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    bar: {
      position: 'absolute',
      left: uScale(16),
      right: uScale(16),
      bottom: uScale(18),
      height: uScale(BAR_HEIGHT),
      borderRadius: uScale(100),
      backgroundColor: colors.tabBarBg,
      borderTopWidth: 0,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      paddingHorizontal: uScale(14),
      // Навігатор інакше додає safe-area інсет знизу і зсуває вміст угору —
      // бар плаваючий, інсет уже враховано через bottom.
      paddingTop: 0,
      paddingBottom: 0,
    },
    item: { height: uScale(BAR_HEIGHT), paddingVertical: uScale(12) },
    label: { fontFamily: fontFamilies.bold, fontSize: uScale(10), marginTop: uScale(2) },
    bubbleIcon: { flex: 0 },
    bubble: {
      width: uScale(52),
      height: uScale(52),
      borderRadius: uScale(26),
      alignItems: 'center',
      justifyContent: 'center',
      transform: [{ translateY: uScale(-14) }],
    },
  });
