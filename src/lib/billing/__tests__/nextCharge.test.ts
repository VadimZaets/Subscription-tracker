import { computeNextChargeAt } from '@/lib/billing/nextCharge';

describe('computeNextChargeAt', () => {
  it('щомісячна: 31 січня → 28 лютого (не 3 березня)', () => {
    const firstCharge = new Date(2026, 0, 31);
    const now = new Date(2026, 1, 1);
    expect(computeNextChargeAt(firstCharge, 'monthly', now)).toEqual(new Date(2026, 1, 28));
  });

  it('щомісячна: повертається до 31-го, коли місяць має 31 день', () => {
    const firstCharge = new Date(2026, 0, 31);
    const now = new Date(2026, 2, 1);
    expect(computeNextChargeAt(firstCharge, 'monthly', now)).toEqual(new Date(2026, 2, 31));
  });

  it('щомісячна: дата в майбутньому лишається якорем', () => {
    const firstCharge = new Date(2026, 7, 21);
    const now = new Date(2026, 7, 19);
    expect(computeNextChargeAt(firstCharge, 'monthly', now)).toEqual(firstCharge);
  });

  it('щорічна: 29 лютого високосного → 28 лютого невисокосного', () => {
    const firstCharge = new Date(2024, 1, 29);
    const now = new Date(2025, 1, 1);
    expect(computeNextChargeAt(firstCharge, 'yearly', now)).toEqual(new Date(2025, 1, 28));
  });

  it('щотижнева: просуває на кратне 7 днів', () => {
    const firstCharge = new Date(2026, 7, 1);
    const now = new Date(2026, 7, 20);
    expect(computeNextChargeAt(firstCharge, 'weekly', now)).toEqual(new Date(2026, 7, 22));
  });

  it('разова: завжди повертає першу дату', () => {
    const firstCharge = new Date(2026, 7, 1);
    const now = new Date(2027, 0, 1);
    expect(computeNextChargeAt(firstCharge, 'once', now)).toEqual(firstCharge);
  });
});
