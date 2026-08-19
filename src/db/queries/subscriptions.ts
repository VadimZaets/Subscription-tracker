import { db } from '@/db/client';
import { subscriptions } from '@/db/schema';

export const listSubscriptions = () => db.select().from(subscriptions);
