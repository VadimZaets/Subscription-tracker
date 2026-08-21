import { useEffect, useMemo, useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import CrossIcon from '@/assets/icon/cross.svg';
import { MerchantLogo } from '@/components/MerchantLogo';
import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { setSetting } from '@/db/queries/settings';
import { fetchNewsForUser, MerchantNews } from '@/lib/news';
import { getRegion } from '@/lib/region';
import { strings } from '@/localization/strings';
import { RootStackScreenProps } from '@/navigation/types';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const newsDateFormatter = new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' });

const formatNewsDate = (iso: string): string => newsDateFormatter.format(new Date(iso));

const directionLabel = (direction: MerchantNews['direction']): string => {
  switch (direction) {
    case 'increase':
      return strings.news.directionIncrease;
    case 'decrease':
      return strings.news.directionDecrease;
    case 'promo':
      return strings.news.directionPromo;
    default:
      return strings.news.directionOther;
  }
};

const directionColorKey = (
  direction: MerchantNews['direction'],
): 'red' | 'good' | 'gold' | 'textDim' => {
  switch (direction) {
    case 'increase':
      return 'red';
    case 'decrease':
    case 'promo':
      return 'good';
    default:
      return 'textDim';
  }
};

export const News = ({ navigation }: RootStackScreenProps<'News'>) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [items, setItems] = useState<MerchantNews[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const region = await getRegion();
      const news = await fetchNewsForUser(region);
      if (!cancelled) setItems(news);
      // Позначаємо все поточне як прочитане одразу як список показано —
      // бейдж на дзвіночку враховує лише те, що з'явиться ПІСЛЯ цього.
      await setSetting('lastSeenNewsAt', new Date().toISOString());
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Screen padded={false} style={styles.pad}>
      <View style={styles.topbar}>
        <Text style={styles.title}>{strings.news.title}</Text>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <CrossIcon width={uScale(20)} height={uScale(20)} color={colors.text} />
        </Pressable>
      </View>

      {items.length === 0 ? (
        <Text style={styles.empty}>{strings.news.empty}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              style={styles.card}
              onPress={() => Linking.openURL(item.sourceUrl)}
            >
              <MerchantLogo domain={item.domain} category="other" color={colors.accent} size={38} />
              <View style={styles.cardMid}>
                <View style={styles.cardHeadRow}>
                  <Text style={styles.merchantName}>{item.merchantName}</Text>
                  <Text
                    style={[styles.direction, { color: colors[directionColorKey(item.direction)] }]}
                  >
                    {directionLabel(item.direction)}
                  </Text>
                </View>
                {item.summaryUk ? <Text style={styles.summary}>{item.summaryUk}</Text> : null}
                {item.publishedAt ? (
                  <Text style={styles.date}>{formatNewsDate(item.publishedAt)}</Text>
                ) : null}
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </Screen>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    pad: { paddingTop: uScale(26), flex: 1 },
    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: uScale(SCREEN_PADDING_H),
      marginBottom: uScale(18),
    },
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(19), color: colors.text },
    closeBtn: {
      width: uScale(34),
      height: uScale(34),
      borderRadius: uScale(12),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
    empty: {
      textAlign: 'center',
      marginTop: uScale(60),
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(14),
      color: colors.textDim,
      paddingHorizontal: uScale(SCREEN_PADDING_H),
    },
    scroll: { paddingHorizontal: uScale(SCREEN_PADDING_H), paddingBottom: uScale(24) },
    card: {
      flexDirection: 'row',
      gap: uScale(12),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      borderRadius: uScale(16),
      padding: uScale(14),
      marginBottom: uScale(12),
    },
    cardMid: { flex: 1 },
    cardHeadRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    merchantName: { fontFamily: fontFamilies.extraBold, fontSize: uFont(14.5), color: colors.text },
    direction: { fontFamily: fontFamilies.bold, fontSize: uFont(11.5) },
    summary: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(12.5),
      color: colors.textDim,
      marginTop: uScale(4),
    },
    date: {
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(11),
      color: colors.textFaint,
      marginTop: uScale(6),
    },
  });
