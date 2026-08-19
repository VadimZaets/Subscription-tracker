import { strings } from '@/localization/strings';
import { BillingCycle } from '@/types/subscription.types';

/** `strings.cycles` — іменники для пілюль у формі ("Місяць"), це — прислівники для рядків ("щомісяця"). */
export const formatCycleAdverb = (cycle: BillingCycle): string => strings.cycleAdverbs[cycle];
