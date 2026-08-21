import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
} from 'react-native-reanimated';

import ArrowToPlusIcon from '@/assets/icon/arrow-to-plus.svg';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { TAB_BAR_CLEARANCE } from '@/components/tabBar.constants';
import { Timeline } from '@/components/Timeline';
import { TimelineRow } from '@/components/TimelineRow';
import { Viewfinder } from '@/components/Viewfinder';
import { getSetting } from '@/db/queries/settings';
import { listSubscriptions } from '@/db/queries/subscriptions';
import { getDefaultCurrency } from '@/lib/currency';
import { formatMoney } from '@/lib/format/money';
import { getFxRateFromUAH } from '@/lib/fx';
import { fetchNewsForUser } from '@/lib/news';
import { getRegion } from '@/lib/region';
import { computeMonthlyTotal } from '@/lib/viewModels/monthlyTotal';
import { toTimelineRowVM } from '@/lib/viewModels/subscriptionRow';
import { strings } from '@/localization/strings';
import { TabScreenProps } from '@/navigation/types';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { CurrencyCode } from '@/types/subscription.types';
import { uFont, uScale } from '@/utils/uScale';

/** Скрол, за який hero встигає повністю згорнутись у компактну смугу. */
const COLLAPSE_DISTANCE = 130;
/** <1 — hero їде вгору повільніше за контент (паралакс). */
const PARALLAX_FACTOR = 0.4;
const COMPACT_BAR_HEIGHT = 54;
/** uScale — звичайна JS-функція, з worklet-а її звати не можна.
 *  Рахуємо один раз тут, у worklet потрапляє вже готове число. */
const COMPACT_BAR_HEIGHT_PX = uScale(COMPACT_BAR_HEIGHT);

export const Home = ({ navigation }: TabScreenProps<'home'>) => {
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

  // computeMonthlyTotal завжди рахує в UAH (кожна підписка вже зберігає
  // fxRate саме до UAH) — displayTotal/displayCurrency лише перекладають цю
  // суму в обрану в Settings валюту, не чіпаючи саме сховище.
  const monthlyTotal = computeMonthlyTotal(activeSubscriptions);
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>('UAH');
  const [displayTotal, setDisplayTotal] = useState(monthlyTotal);

  // Round — сума з конвертації валют завжди дробова (courses ×44.65 і т.д.),
  // а для орієнтовного місячного/річного підсумку копійки лише шумлять.
  const monthlyTotalLabel = formatMoney(Math.round(displayTotal), displayCurrency);
  const yearlySummary = strings.home.yearlySummary(
    formatMoney(Math.round(displayTotal * 12), displayCurrency),
  );
  const nextCharge = rows[0];

  const [hasUnreadNews, setHasUnreadNews] = useState(false);

  // useFocusEffect — та сама причина, що й для новин нижче: валюту можна
  // змінити в Settings (інший таб) і повернутись назад без розмонтування
  // Home, тож простий useEffect на маунт цього не підхопить.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        const currency = await getDefaultCurrency();
        const rate = await getFxRateFromUAH(currency);
        if (cancelled) return;
        setDisplayCurrency(currency);
        setDisplayTotal(monthlyTotal * rate);
      })();

      return () => {
        cancelled = true;
      };
    }, [monthlyTotal]),
  );

  // useFocusEffect, не звичайний useEffect — Home лишається змонтованим, поки
  // ти на News і повертаєшся назад (таб-екрани не розмонтовуються), тож
  // перевірку треба повторювати на кожен фокус, інакше крапка не зникає після
  // прочитання новин (lastSeenNewsAt у БД вже оновився, а стан тут — ще ні).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      (async () => {
        const [region, lastSeenAt] = await Promise.all([getRegion(), getSetting('lastSeenNewsAt')]);
        const news = await fetchNewsForUser(region);
        if (cancelled) return;
        const unread = lastSeenAt
          ? news.some((item) => (item.publishedAt ?? '') > lastSeenAt)
          : news.length > 0;
        setHasUnreadNews(unread);
      })();

      return () => {
        cancelled = true;
      };
    }, []),
  );

  // Порожній стан рендериться без ScrollView — без цього compactBar лишався б
  // "проскроленим" (видимим) зі старого scrollY, а hero не з'являвся б, поки
  // не почнеш скролити заново (нічим, бо списку вже нема).
  useEffect(() => {
    if (rows.length === 0) scrollY.value = 0;
  }, [rows.length, scrollY]);

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
        <Pressable style={styles.bell} onPress={() => navigation.navigate('News')}>
          <FontAwesome name="newspaper-o" size={uScale(16)} color={colors.text} />
          {hasUnreadNews ? <View style={styles.bellDot} /> : null}
        </Pressable>
      </View>

      <View style={styles.body}>
        {rows.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>{strings.home.emptyTitle}</Text>
            <Text style={styles.emptySub}>{strings.home.emptySub}</Text>
          </View>
        ) : (
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
            ) : null}

            <View style={styles.sectionHead}>
              <Text style={styles.sectionTitle}>{strings.home.timelineTitle}</Text>
              <Text style={styles.sectionLink}>{strings.home.timelineCount(rows.length)}</Text>
            </View>

            <Timeline>
              {rows.map((row, index) => (
                <Pressable
                  key={row.id}
                  onPress={() => navigation.navigate('SubscriptionDetail', { id: row.id })}
                >
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
                    isLast={index === rows.length - 1}
                  />
                </Pressable>
              ))}
            </Timeline>
          </Animated.ScrollView>
        )}

        <Animated.View style={[styles.compactBar, compactStyle]} pointerEvents="none">
          <Text style={styles.compactLabel}>{strings.home.thisMonth}</Text>
          <Text style={styles.compactAmount}>{monthlyTotalLabel}</Text>
        </Animated.View>

        {rows.length === 0 ? (
          <View style={styles.emptyCtaWrap} pointerEvents="none">
            <Text style={styles.emptyCtaText}>{strings.home.emptyCta}</Text>
            <ArrowToPlusIcon
              width={uScale(72)}
              height={uScale(72)}
              color={colors.textDim}
              style={styles.emptyCtaArrow}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
};

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
      // Прозорий — інакше суцільний colors.bg дає видиму «полоску» на межі з
      // градієнтом TopBackground. compactBar нижче лишається непрозорим
      // навмисно: він перекриває скрольований контент і мусить його ховати.
      backgroundColor: colors.transparent,
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
    sectionTitle: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(16),
      color: colors.text,
      marginBottom: uScale(8),
    },
    sectionLink: { fontFamily: fontFamilies.bold, fontSize: uFont(12.5), color: colors.accent2 },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: uScale(SCREEN_PADDING_H + 12),
      paddingBottom: uScale(TAB_BAR_CLEARANCE),
    },
    emptyTitle: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(19),
      color: colors.text,
      textAlign: 'center',
    },
    emptySub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(14),
      lineHeight: uFont(20),
      color: colors.textDim,
      textAlign: 'center',
      marginTop: uScale(10),
      maxWidth: uScale(260),
    },
    // Стрілка від тексту до кнопки «+» таб-бара — та сама горизонтальна
    // позиція, що й середній таб (add-action), тому right тут не потрібен,
    // блок центрований по ширині екрана.
    emptyCtaWrap: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: uScale(TAB_BAR_CLEARANCE + 20),
      alignItems: 'center',
    },
    emptyCtaText: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13.5),
      color: colors.textDim,
      marginBottom: uScale(12),
    },
    emptyCtaArrow: {
      transform: [{ rotate: '185deg' }],
    },
  });
