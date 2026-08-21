import { youtubeReceiptFixture } from '@/ocr/__fixtures__/youtubeReceipt.fixture';
import { parseReceipt } from '@/ocr/parseReceipt';

describe('parseReceipt', () => {
  const result = parseReceipt(youtubeReceiptFixture);

  it('обирає перший нецифровий рядок як мерчанта з низькою впевненістю', () => {
    expect(result.merchant).toEqual({ value: 'YouTube Premium', confidence: 'low' });
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
