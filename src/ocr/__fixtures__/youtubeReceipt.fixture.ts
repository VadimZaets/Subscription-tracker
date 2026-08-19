import { OcrResult } from '@/ocr/recognizeText';

// Реальний вивід Vision OCR зі скріншота email-підтвердження YouTube Premium,
// зібраний під час ручної валідації Кроку 2 (не синтетика).
export const youtubeReceiptFixture: OcrResult = {
  fullText:
    '20:47 34) YouTube Premium Вітаємо, Вадим! Ви оформили підписку на YouTube Premium. Починаючи з 14 вер. 2026 р., ми почнемо щомісяця стягувати плату за підписку, використовуючи вказаний Вами спосіб оплати. Щоб переглянути умови своєї підписки, керувати нею або скасувати її, перейдіть у налаштування облікового запису в додатку YouTube. ПОЧАТИ Приємного користування! Команда YouTube Інформація про підписку YouTube Premium Підписка 99,00 грн Щомісячне стягнення плати Дата першого стягнення: 14 вер. 2026 р. 99,00 грн До сплати сьогодні Оплачено за допомогою Visa ...• 5342 99,00 грн (Включає Податок 16,50 грн) Дата замовлення 14 вер. 2026 Відповісти Переслати',
  blocks: [
    { text: '20:47', confidence: 0.3, level: 'line' },
    { text: '34)', confidence: 1.0, level: 'line' },
    { text: 'YouTube Premium', confidence: 1.0, level: 'line' },
    { text: 'Вітаємо, Вадим!', confidence: 0.5, level: 'line' },
    {
      text: 'Ви оформили підписку на YouTube Premium. Починаючи з 14',
      confidence: 0.5,
      level: 'line',
    },
    {
      text: 'вер. 2026 р., ми почнемо щомісяця стягувати плату за підписку,',
      confidence: 1.0,
      level: 'line',
    },
    { text: 'використовуючи вказаний Вами спосіб оплати.', confidence: 1.0, level: 'line' },
    {
      text: 'Щоб переглянути умови своєї підписки, керувати нею або',
      confidence: 1.0,
      level: 'line',
    },
    {
      text: 'скасувати її, перейдіть у налаштування облікового запису в',
      confidence: 1.0,
      level: 'line',
    },
    { text: 'додатку YouTube.', confidence: 1.0, level: 'line' },
    { text: 'ПОЧАТИ', confidence: 1.0, level: 'line' },
    { text: 'Приємного користування!', confidence: 1.0, level: 'line' },
    { text: 'Команда YouTube', confidence: 1.0, level: 'line' },
    { text: 'Інформація про підписку', confidence: 1.0, level: 'line' },
    { text: 'YouTube Premium', confidence: 1.0, level: 'line' },
    { text: 'Підписка', confidence: 1.0, level: 'line' },
    { text: '99,00 грн', confidence: 1.0, level: 'line' },
    { text: 'Щомісячне стягнення плати', confidence: 0.5, level: 'line' },
    { text: 'Дата першого стягнення: 14 вер. 2026 р.', confidence: 0.5, level: 'line' },
    { text: '99,00 грн', confidence: 1.0, level: 'line' },
    { text: 'До сплати сьогодні', confidence: 1.0, level: 'line' },
    { text: 'Оплачено за допомогою Visa ...• 5342', confidence: 1.0, level: 'line' },
    { text: '99,00 грн', confidence: 1.0, level: 'line' },
    { text: '(Включає Податок', confidence: 0.5, level: 'line' },
    { text: '16,50 грн)', confidence: 1.0, level: 'line' },
    { text: 'Дата замовлення', confidence: 0.5, level: 'line' },
    { text: '14 вер. 2026', confidence: 1.0, level: 'line' },
    { text: '5 Відповісти', confidence: 1.0, level: 'line' },
    { text: '~ Переслати', confidence: 0.5, level: 'line' },
  ],
};
