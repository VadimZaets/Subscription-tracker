// Стеми українських назв місяців — покривають і скорочену форму ("вер."),
// і відмінкову ("вересня"), бо обидві починаються з того самого стему.
export const MONTH_STEMS = [
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

export const resolveMonthIndex = (monthWord: string): number => {
  const normalized = monthWord.toLowerCase();
  return MONTH_STEMS.findIndex((stem) => normalized.startsWith(stem));
};

/** «23 серпня» без року — Передплати App Store завжди показують МАЙБУТНЄ поновлення,
 *  тож якщо дата в поточному році вже минула, це відноситься до наступного року. */
export const resolveNextOccurrence = (day: number, monthWord: string, now: Date): Date | null => {
  const monthIndex = resolveMonthIndex(monthWord);
  if (monthIndex === -1) return null;

  const candidate = new Date(now.getFullYear(), monthIndex, day);
  if (candidate.getTime() < new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()) {
    candidate.setFullYear(candidate.getFullYear() + 1);
  }

  return candidate;
};
