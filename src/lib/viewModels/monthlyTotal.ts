import { BillingCycle, Subscription } from '@/types/subscription.types';

const CYCLE_TO_MONTHLY_FACTOR: Record<BillingCycle, number> = {
  weekly: 52 / 12,
  monthly: 1,
  yearly: 1 / 12,
  once: 0,
};

/** Сума в базовій валюті (UAH) — кожен `amount` уже приведений через `fxRate` на дату платежу. */
export const computeMonthlyTotal = (subscriptions: Subscription[]): number =>
  subscriptions
    .filter((sub) => sub.status === 'active')
    .reduce((sum, sub) => sum + sub.amount * sub.fxRate * CYCLE_TO_MONTHLY_FACTOR[sub.cycle], 0);
