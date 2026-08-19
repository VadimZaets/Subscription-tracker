const MS_PER_DAY = 86_400_000;

const SHORT_MONTHS = [
  'січ',
  'лют',
  'бер',
  'квіт',
  'трав',
  'черв',
  'лип',
  'серп',
  'вер',
  'жовт',
  'лист',
  'груд',
];

const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

/** `new Date('YYYY-MM-DD')` парситься як UTC-північ — у західних часових поясах це
 *  «зсуває» дату на день назад. Дати зберігаються без часу, тож парсимо їх локально. */
const parseIsoDate = (iso: string): Date => {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/** Українська плюралізація днів: 1 день / 2-4 дні / 5-20, 25-30... днів, виняток 11-14. */
const pluralizeDays = (count: number): string => {
  const abs = Math.abs(count);
  const mod100 = abs % 100;
  const mod10 = abs % 10;

  if (mod100 >= 11 && mod100 <= 14) return 'днів';
  if (mod10 === 1) return 'день';
  if (mod10 >= 2 && mod10 <= 4) return 'дні';
  return 'днів';
};

/** `now` — завжди параметр, ніколи `Date.now()` усередині, інакше функція не тестується. */
export const formatWhen = (targetIso: string, now: Date): string => {
  const target = startOfDay(parseIsoDate(targetIso));
  const today = startOfDay(now);
  const diffDays = Math.round((target.getTime() - today.getTime()) / MS_PER_DAY);

  if (diffDays === 0) return 'сьогодні';
  if (diffDays === 1) return 'завтра';
  if (diffDays === -1) return 'вчора';
  if (diffDays > 1) return `через ${diffDays} ${pluralizeDays(diffDays)}`;
  return `${Math.abs(diffDays)} ${pluralizeDays(diffDays)} тому`;
};

export const formatShortDate = (iso: string): string => {
  const date = parseIsoDate(iso);
  return `${date.getDate()} ${SHORT_MONTHS[date.getMonth()]}`;
};
