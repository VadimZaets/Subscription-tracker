import { Ionicons } from '@expo/vector-icons';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { TAB_BAR_CLEARANCE } from '@/components/tabBar.constants';
import { Timeline } from '@/components/Timeline';
import { TimelineRow } from '@/components/TimelineRow';
import { Viewfinder } from '@/components/Viewfinder';
import { listSubscriptions } from '@/db/queries/subscriptions';
import { formatMoney } from '@/lib/format/money';
import { computeMonthlyTotal } from '@/lib/viewModels/monthlyTotal';
import { toTimelineRowVM } from '@/lib/viewModels/subscriptionRow';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

/** Скрол, за який hero встигає повністю згорнутись у компактну смугу. */
const COLLAPSE_DISTANCE = 130;
/** <1 — hero їде вгору повільніше за контент (паралакс). */
const PARALLAX_FACTOR = 0.4;
const COMPACT_BAR_HEIGHT = 54;
/** uScale — звичайна JS-функція, з worklet-а її звати не можна.
 *  Рахуємо один раз тут, у worklet потрапляє вже готове число. */
const COMPACT_BAR_HEIGHT_PX = uScale(COMPACT_BAR_HEIGHT);

const Home = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const reducedMotion = useReducedMotion();
  const scrollY = useSharedValue(0);
  const now = new Date();

  const { data: subscriptions } = useLiveQuery(listSubscriptions());
  const activeSubscriptions = subscriptions
    .filter((sub) => sub.status === 'active')
    .sort((a, b) => a.nextChargeAt.localeCompare(b.nextChargeAt));
  const rows = activeSubscriptions.map((sub) => toTimelineRowVM(sub, now));

  const monthlyTotal = computeMonthlyTotal(activeSubscriptions);
  const monthlyTotalLabel = formatMoney(monthlyTotal, 'UAH');
  const yearlySummary = strings.home.yearlySummary(formatMoney(monthlyTotal * 12, 'UAH'));
  const nextCharge = rows[0];

  const handleScroll = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [0, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    );

    // Reduce Motion: лишаємо тільки згасання, без руху та масштабування.
    // Набір ключів стилю має бути стабільним, тому нейтралізуємо значення, а не гілку.
    return {
      opacity: interpolate(progress, [0, 0.85], [1, 0], Extrapolation.CLAMP),
      transform: [
        { translateY: reducedMotion ? 0 : scrollY.value * PARALLAX_FACTOR },
        {
          scale: reducedMotion ? 1 : interpolate(progress, [0, 1], [1, 0.9], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const compactStyle = useAnimatedStyle(() => {
    const progress = interpolate(
      scrollY.value,
      [COLLAPSE_DISTANCE * 0.6, COLLAPSE_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity: progress,
      transform: [
        {
          translateY: reducedMotion
            ? 0
            : interpolate(progress, [0, 1], [-COMPACT_BAR_HEIGHT_PX, 0]),
        },
      ],
    };
  });

  return (
    <Screen padded={false} edges={TAB_SCREEN_EDGES}>
      <View style={styles.topbar}>
        <View>
          <Text style={styles.eyebrow}>{strings.home.eyebrow}</Text>
          <Text style={styles.title}>{strings.home.title}</Text>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications-outline" size={uScale(18)} color={colors.text} />
          <View style={styles.bellDot} />
        </View>
      </View>

      <View style={styles.body}>
        <Animated.ScrollView
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {nextCharge ? (
            <Animated.View style={heroStyle}>
              <Viewfinder
                label={strings.home.thisMonth}
                amount={monthlyTotalLabel}
                sub={yearlySummary}
              />
            </Animated.View>
          ) : (
            <Text style={styles.emptyTitle}>{strings.home.emptyTitle}</Text>
          )}

          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>{strings.home.timelineTitle}</Text>
            <Text style={styles.sectionLink}>{strings.home.timelineCount(rows.length)}</Text>
          </View>

          <Timeline>
            {rows.map((row, index) => (
              <Pressable key={row.id} onPress={() => router.push(`/subscription/${row.id}`)}>
                <TimelineRow
                  date={row.date}
                  when={row.when}
                  name={row.name}
                  category={row.category}
                  categoryLabel={strings.categories[row.category]}
                  categoryColor={row.categoryColor}
                  domain={row.domain}
                  price={row.price}
                  cycle={row.cycle}
                  isScanned={row.isScanned}
                  isLast={index === rows.length - 1}
                />
              </Pressable>
            ))}
          </Timeline>
        </Animated.ScrollView>

        <Animated.View style={[styles.compactBar, compactStyle]} pointerEvents="none">
          <Text style={styles.compactLabel}>{strings.home.thisMonth}</Text>
          <Text style={styles.compactAmount}>{monthlyTotalLabel}</Text>
        </Animated.View>
      </View>
    </Screen>
  );
};

export default Home;

const TAB_SCREEN_EDGES = ['top'] as const;

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingBottom: uScale(18),
      zIndex: 2,
      backgroundColor: colors.bg,
    },
    eyebrow: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(12),
      letterSpacing: 2,
      textTransform: 'uppercase',
      color: colors.textFaint,
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(22),
      color: colors.text,
      marginTop: uScale(4),
    },
    bell: {
      width: uScale(42),
      height: uScale(42),
      borderRadius: uScale(14),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    bellDot: {
      position: 'absolute',
      top: uScale(10),
      right: uScale(11),
      width: uScale(7),
      height: uScale(7),
      borderRadius: uScale(4),
      backgroundColor: colors.red,
      borderWidth: 2,
      borderColor: colors.bg,
    },
    // overflow: hidden — щоб компактна смуга «виїжджала» з-під хедера, а не над ним.
    body: { flex: 1, overflow: 'hidden' },
    scroll: {
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      paddingBottom: uScale(TAB_BAR_CLEARANCE),
    },
    compactBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: COMPACT_BAR_HEIGHT_PX,
      flexDirection: 'row',
      alignItems: 'center',
      gap: uScale(10),
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      backgroundColor: colors.bg,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderGlass,
    },
    compactLabel: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(10),
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: colors.textFaint,
    },
    compactAmount: { fontFamily: fontFamilies.extraBold, fontSize: uFont(17), color: colors.text },
    compactDivider: {
      width: 1,
      height: uScale(14),
      backgroundColor: colors.borderGlass,
    },
    compactNext: {
      flex: 1,
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(12),
      color: colors.textDim,
    },
    sectionHead: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: uScale(14),
    },
    sectionTitle: { fontFamily: fontFamilies.extraBold, fontSize: uFont(16), color: colors.text },
    sectionLink: { fontFamily: fontFamilies.bold, fontSize: uFont(12.5), color: colors.accent2 },
    emptyTitle: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(14),
      color: colors.textDim,
      textAlign: 'center',
      paddingVertical: uScale(30),
    },
  });
