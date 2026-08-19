import { resolveMonthIndex, resolveNextOccurrence } from '@/lib/format/ukrainianMonth';

describe('resolveMonthIndex', () => {
  it('розпізнає скорочену форму зі крапкою', () => {
    expect(resolveMonthIndex('вер.')).toBe(8);
  });

  it('розпізнає відмінкову форму', () => {
    expect(resolveMonthIndex('вересня')).toBe(8);
  });

  it('повертає -1 для невідомого слова', () => {
    expect(resolveMonthIndex('щось')).toBe(-1);
  });
});

describe('resolveNextOccurrence', () => {
  it('лишає дату в поточному році, якщо вона ще не минула', () => {
    const now = new Date(2026, 7, 19);
    expect(resolveNextOccurrence(23, 'серпня', now)).toEqual(new Date(2026, 7, 23));
  });

  it('переносить на наступний рік, якщо дата вже минула', () => {
    const now = new Date(2026, 7, 19);
    expect(resolveNextOccurrence(1, 'січня', now)).toEqual(new Date(2027, 0, 1));
  });

  it('трактує сьогодні як таке, що ще не минуло', () => {
    const now = new Date(2026, 7, 19);
    expect(resolveNextOccurrence(19, 'серпня', now)).toEqual(new Date(2026, 7, 19));
  });
});
