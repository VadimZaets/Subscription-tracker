import { Image } from 'expo-image';
import { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';

import { CategoryBadge } from '@/components/CategoryBadge';
import { buildLogoUrlByDomain } from '@/lib/logoDev';
import { Category } from '@/types/category.types';
import { uScale } from '@/utils/uScale';

type MerchantLogoProps = {
  domain?: string | null;
  category: Category;
  color: string;
  size?: number;
};

/**
 * Реальне лого мерчанта через Logo.dev — лише за точним доменом (Supabase-кеш
 * або AI-lookup). Пошук за назвою свідомо НЕ використовується: на нечітких
 * назвах (наприклад "Monthly RNI Pro Subscription") Logo.dev повертає найближчий
 * збіг замість 404 — чуже лого гірше за відсутнє, воно бреше про бренд.
 * Невідомий домен (мерчант поза каталогом) — одразу CategoryBadge, без вгадування.
 *
 * Суцільне заповнення без відступів і без рамки: частина лого приходить із
 * власним квадратним фоном (Getcontact, YouTube) — будь-який внутрішній відступ
 * лишає його кути видимими всередині кола. `overflow: hidden` сам обрізає квадрат
 * у рівне коло, без шва. Контраст на темній темі рахує CDN (`theme=dark`).
 */
export const MerchantLogo = ({ domain, category, color, size = 42 }: MerchantLogoProps) => {
  const [failed, setFailed] = useState(false);
  const styles = useMemo(() => makeStyles(size), [size]);

  if (!domain || failed) {
    return <CategoryBadge category={category} color={color} size={size} />;
  }

  return (
    <Image
      source={{ uri: buildLogoUrlByDomain(domain, size) }}
      style={styles.image}
      contentFit="cover"
      // Пам'ять+диск — інакше кожен ре-рендер (useLiveQuery тригерить їх часто)
      // може повторно смикати мережу й давати видимий спалах "порожньо → лого".
      cachePolicy="memory-disk"
      transition={0}
      onError={() => setFailed(true)}
    />
  );
};

const makeStyles = (size: number) =>
  StyleSheet.create({
    image: {
      width: uScale(size),
      height: uScale(size),
      borderRadius: uScale(size / 2),
    },
  });
