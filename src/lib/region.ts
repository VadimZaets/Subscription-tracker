import * as Localization from 'expo-localization';

import { getSetting, setSetting } from '@/db/queries/settings';

const REGION_SETTING_KEY = 'region';

export const SUPPORTED_REGIONS = ['UA', 'US', 'EU'] as const;
export type Region = (typeof SUPPORTED_REGIONS)[number] | 'OTHER';

const deviceRegion = (): Region => {
  const code = Localization.getLocales()[0]?.regionCode;
  return (SUPPORTED_REGIONS as readonly string[]).includes(code ?? '') ? (code as Region) : 'OTHER';
};

/** Ручний оверрайд у Settings має пріоритет; інакше — регіон пристрою
 *  (best-effort, без accounts все одно ніде його не зберегти інакше). */
export const getRegion = async (): Promise<Region> => {
  const stored = await getSetting(REGION_SETTING_KEY);
  if (stored && (SUPPORTED_REGIONS as readonly string[]).includes(stored)) return stored as Region;
  if (stored === 'OTHER') return 'OTHER';
  return deviceRegion();
};

export const setRegion = (region: Region) => setSetting(REGION_SETTING_KEY, region);
