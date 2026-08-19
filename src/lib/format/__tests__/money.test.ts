import { formatMoney } from '@/lib/format/money';

describe('formatMoney', () => {
  it('форматує гривню без розділювача тисяч', () => {
    expect(formatMoney(379, 'UAH')).toBe('379 ₴');
  });

  it('групує тисячі', () => {
    expect(formatMoney(3480, 'UAH')).toBe('3 480 ₴');
  });

  it('округлює дробову суму', () => {
    expect(formatMoney(159.6, 'UAH')).toBe('160 ₴');
  });

  it('форматує долар', () => {
    expect(formatMoney(24.99, 'USD')).toBe('25 $');
  });

  it("віддзеркалює знак для від'ємної суми", () => {
    expect(formatMoney(-100, 'UAH')).toBe('-100 ₴');
  });
});
