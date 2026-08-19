import { formatShortDate, formatWhen } from '@/lib/format/date';

describe('formatWhen', () => {
  const now = new Date(2026, 7, 19); // 19 серпня 2026

  it('сьогодні', () => {
    expect(formatWhen('2026-08-19', now)).toBe('сьогодні');
  });

  it('завтра', () => {
    expect(formatWhen('2026-08-20', now)).toBe('завтра');
  });

  it('через 2 дні', () => {
    expect(formatWhen('2026-08-21', now)).toBe('через 2 дні');
  });

  it('через 5 днів', () => {
    expect(formatWhen('2026-08-24', now)).toBe('через 5 днів');
  });

  it('через 11 днів — виняток 11-14', () => {
    expect(formatWhen('2026-08-30', now)).toBe('через 11 днів');
  });

  it('через 14 днів — виняток 11-14', () => {
    expect(formatWhen('2026-09-02', now)).toBe('через 14 днів');
  });

  it('через 21 день — остання цифра 1, але не 11', () => {
    expect(formatWhen('2026-09-09', now)).toBe('через 21 день');
  });

  it('переходить через межу року', () => {
    const newYearEve = new Date(2026, 11, 30);
    expect(formatWhen('2027-01-02', newYearEve)).toBe('через 3 дні');
  });

  it('вчора', () => {
    expect(formatWhen('2026-08-18', now)).toBe('вчора');
  });

  it('5 днів тому', () => {
    expect(formatWhen('2026-08-14', now)).toBe('5 днів тому');
  });
});

describe('formatShortDate', () => {
  it('формує "день місяць" українською', () => {
    expect(formatShortDate('2026-08-21')).toBe('21 серп');
  });
});
