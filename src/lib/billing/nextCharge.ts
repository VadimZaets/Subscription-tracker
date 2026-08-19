import { BillingCycle } from '@/types/subscription.types';

const MS_PER_DAY = 86_400_000;

const daysInMonth = (year: number, monthIndex: number): number =>
  new Date(year, monthIndex + 1, 0).getDate();

/** Додає місяці, притискаючи день до кінця цільового місяця (31 січ + 1 міс → 28/29 лют,
 *  не 3 березня, як дав би наївний `setMonth`). */
const addMonthsClamped = (date: Date, months: number): Date => {
  const anchorDay = date.getDate();
  const targetIndex = date.getMonth() + months;
  const year = date.getFullYear() + Math.floor(targetIndex / 12);
  const month = ((targetIndex % 12) + 12) % 12;
  return new Date(year, month, Math.min(anchorDay, daysInMonth(year, month)));
};

const addYearsClamped = (date: Date, years: number): Date => addMonthsClamped(date, years * 12);

/** Найближче списання на момент чи після `now`, з якірною датою `firstChargeAt`.
 *  `now` — параметр, ніколи `Date.now()` усередині. */
export const computeNextChargeAt = (firstChargeAt: Date, cycle: BillingCycle, now: Date): Date => {
  if (cycle === 'once') return firstChargeAt;

  if (cycle === 'weekly') {
    const elapsedDays = Math.max(
      0,
      Math.ceil((now.getTime() - firstChargeAt.getTime()) / MS_PER_DAY),
    );
    const weeksElapsed = Math.ceil(elapsedDays / 7);
    return new Date(
      firstChargeAt.getFullYear(),
      firstChargeAt.getMonth(),
      firstChargeAt.getDate() + weeksElapsed * 7,
    );
  }

  const step = cycle === 'monthly' ? addMonthsClamped : addYearsClamped;
  let k = 0;
  let next = firstChargeAt;
  while (next.getTime() < now.getTime()) {
    k += 1;
    next = step(firstChargeAt, k);
  }
  return next;
};
