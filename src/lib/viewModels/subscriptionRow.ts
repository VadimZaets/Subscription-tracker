import { formatCycleAdverb } from '@/lib/format/cycle';
import { formatShortDate, formatWhen } from '@/lib/format/date';
import { formatMoney } from '@/lib/format/money';
import { findMerchant } from '@/ocr/merchants.catalog';
import { categoryColors } from '@/theme/colors';
import { Category } from '@/types/category.types';
import { Subscription } from '@/types/subscription.types';

export type TimelineRowVM = {
  id: string;
  name: string;
  category: Category;
  categoryColor: string;
  price: string;
  cycle: string;
  date: string;
  when: string;
  isScanned: boolean;
};

/** `now` — параметр, ніколи `Date.now()` усередині, інакше view-model не тестується. */
export const toTimelineRowVM = (sub: Subscription, now: Date): TimelineRowVM => {
  const merchant = findMerchant(sub.name);
  const categoryColor = merchant?.color ?? categoryColors[sub.category];

  return {
    id: sub.id,
    name: sub.name,
    category: sub.category,
    categoryColor,
    price: formatMoney(sub.amount, sub.currency),
    cycle: formatCycleAdverb(sub.cycle),
    date: formatShortDate(sub.nextChargeAt),
    when: formatWhen(sub.nextChargeAt, now),
    isScanned: sub.source !== 'manual',
  };
};
