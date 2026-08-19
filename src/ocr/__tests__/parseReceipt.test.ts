import { youtubeReceiptFixture } from '@/ocr/__fixtures__/youtubeReceipt.fixture';
import { parseReceipt } from '@/ocr/parseReceipt';

describe('parseReceipt', () => {
  const result = parseReceipt(youtubeReceiptFixture);

  it('розпізнає мерчанта через merchants.catalog з високою впевненістю', () => {
    expect(result.merchant).toEqual({ value: 'YouTube Premium', confidence: 'high' });
  });

  it('обирає суму, що повторюється найчастіше, з високою впевненістю', () => {
    expect(result.amount).toEqual({
      value: { amount: 99, currency: 'UAH' },
      confidence: 'high',
    });
  });

  it('розпізнає дату списання', () => {
    expect(result.chargedAt).toEqual({
      value: new Date(2026, 8, 14),
      confidence: 'high',
    });
  });
});
