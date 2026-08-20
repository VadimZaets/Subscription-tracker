import { appStoreSubscriptionsFixture } from '@/ocr/__fixtures__/appStoreSubscriptions.fixture';
import { parseAppStoreScreenshot } from '@/ocr/parseAppStoreScreenshot';

describe('parseAppStoreScreenshot', () => {
  const now = new Date(2026, 7, 19); // 19 серпня 2026 — той самий день, коли зроблено скріншот
  const result = parseAppStoreScreenshot(appStoreSubscriptionsFixture, now);

  it('знаходить рівно 3 активні підписки, ігноруючи прострочену й службові рядки', () => {
    expect(result).toHaveLength(3);
  });

  it('розпізнає Getcontact і резолвить дату поновлення в поточному році', () => {
    expect(result).toContainEqual({
      name: 'Getcontact',
      category: 'software',
      amount: 1.99,
      currency: 'USD',
      renewsAtText: '23 серпня',
      renewsAt: new Date(2026, 7, 23),
    });
  });

  it('розпізнає iCloud+ і резолвить категорію cloud через merchants.catalog', () => {
    expect(result).toContainEqual({
      name: 'iCloud+',
      category: 'cloud',
      amount: 2.99,
      currency: 'USD',
      renewsAtText: '14 вересня',
      renewsAt: new Date(2026, 8, 14),
    });
  });

  it('розпізнає Monthly RNI Pro Subscription і резолвить категорію через каталог', () => {
    expect(result).toContainEqual({
      name: 'Monthly RNI Pro Subscription',
      category: 'software',
      amount: 2.49,
      currency: 'USD',
      renewsAtText: '20 серпня',
      renewsAt: new Date(2026, 7, 20),
    });
  });

  it('пропускає прострочену Apple Music (немає рядка ціни)', () => {
    expect(result.some((sub) => sub.name === 'Apple Music')).toBe(false);
  });

  it('переносить дату на наступний рік, якщо вона вже минула цього року', () => {
    const lateNow = new Date(2026, 11, 25); // 25 грудня 2026
    const [getcontact] = parseAppStoreScreenshot(appStoreSubscriptionsFixture, lateNow);
    expect(getcontact.renewsAt).toEqual(new Date(2027, 7, 23));
  });
});
