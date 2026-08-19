import { formatMoney } from '@/lib/format/money';

describe('formatMoney', () => {
  it('форматує гривню без розділювача тисяч', () => {
    expect(formatMoney(379, 'UAH')).toBe('379 ₴');
  });

  it('групує тисячі', () => {
    expect(formatMoney(3480, 'UAH')).toBe('3 480 ₴');
  });

  it('лишає копійки замість округлення до цілого', () => {
    expect(formatMoney(159.6, 'UAH')).toBe('159,60 ₴');
  });

  it('форматує долар із копійками, не округлюючи їх геть', () => {
    expect(formatMoney(1.99, 'USD')).toBe('1,99 $');
  });

  it('округлює лише до копійок, коли їх більше двох знаків', () => {
    expect(formatMoney(24.999, 'USD')).toBe('25 $');
  });

  it("віддзеркалює знак для від'ємної суми", () => {
    expect(formatMoney(-100, 'UAH')).toBe('-100 ₴');
  });

  it('не показує копійки для цілої суми', () => {
    expect(formatMoney(2.0, 'USD')).toBe('2 $');
  });
});
