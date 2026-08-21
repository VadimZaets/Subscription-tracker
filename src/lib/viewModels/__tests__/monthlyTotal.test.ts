import { computeMonthlyTotal } from '@/lib/viewModels/monthlyTotal';
import { Subscription } from '@/types/subscription.types';

const makeSub = (overrides: Partial<Subscription>): Subscription => ({
  id: 'x',
  name: 'X',
  category: 'other',
  domain: null,
  cancelUrl: null,
  status: 'active',
  source: 'manual',
  amount: 100,
  currency: 'UAH',
  fxRate: 1,
  cycle: 'monthly',
  nextChargeAt: '2026-08-20',
  createdAt: '2026-01-01',
  ...overrides,
});

describe('computeMonthlyTotal', () => {
  it('додає щомісячні підписки напряму', () => {
    const total = computeMonthlyTotal([makeSub({ amount: 379 }), makeSub({ amount: 159 })]);
    expect(total).toBeCloseTo(538);
  });

  it('зводить річну підписку до місячного еквіваленту', () => {
    const total = computeMonthlyTotal([makeSub({ amount: 1200, cycle: 'yearly' })]);
    expect(total).toBeCloseTo(100);
  });

  it('зводить тижневу підписку до місячного еквіваленту', () => {
    const total = computeMonthlyTotal([makeSub({ amount: 100, cycle: 'weekly' })]);
    expect(total).toBeCloseTo((100 * 52) / 12);
  });

  it('ігнорує неактивні підписки', () => {
    const total = computeMonthlyTotal([makeSub({ amount: 500, status: 'paused' })]);
    expect(total).toBe(0);
  });

  it('застосовує fxRate для валюти, відмінної від базової', () => {
    const total = computeMonthlyTotal([makeSub({ amount: 10, currency: 'USD', fxRate: 41.5 })]);
    expect(total).toBeCloseTo(415);
  });

  it('разова підписка не входить у щомісячний підсумок', () => {
    const total = computeMonthlyTotal([makeSub({ amount: 500, cycle: 'once' })]);
    expect(total).toBe(0);
  });
});
