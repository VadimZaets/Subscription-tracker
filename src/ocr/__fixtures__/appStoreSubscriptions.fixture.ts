import { OcrResult } from '@/ocr/recognizeText';

// Реальний вивід Vision OCR (recognitionLevel: 'line') зі скріншота
// Налаштування → [Ім'я] → Передплати на фізичному iPhone, зібраний під час
// ручної валідації гейту Кроку 2. НЕ синтетичний — саме тому в ньому лишені
// дублікати назв, обрізаний рядок сортування і різна впевненість по рядках.
export const appStoreSubscriptionsFixture: OcrResult = {
  fullText: '',
  blocks: [
    { text: '20:554', confidence: 1.0, level: 'line' },
    { text: 'Передплати', confidence: 0.5, level: 'line' },
    { text: 'Активні', confidence: 0.5, level: 'line' },
    { text: 'Сортувати т', confidence: 0.3, level: 'line' },
    { text: 'Apple Music', confidence: 1.0, level: 'line' },
    { text: 'Сімейна', confidence: 0.5, level: 'line' },
    { text: 'Сплила 19 серпня', confidence: 0.5, level: 'line' },
    { text: 'Getcontact', confidence: 1.0, level: 'line' },
    { text: 'Getcontact Subscription', confidence: 1.0, level: 'line' },
    { text: 'Поновиться 23 серпня', confidence: 0.5, level: 'line' },
    { text: '1,99 USD >', confidence: 1.0, level: 'line' },
    { text: 'iCloud+', confidence: 1.0, level: 'line' },
    { text: 'iCloud+ з обсягом 200 ГБ', confidence: 0.5, level: 'line' },
    { text: 'Поновиться 14 вересня', confidence: 1.0, level: 'line' },
    { text: '2,99 USD >', confidence: 1.0, level: 'line' },
    { text: 'Monthly RNI Pro Subscription', confidence: 1.0, level: 'line' },
    { text: 'Monthly RNI Pro Subscription', confidence: 1.0, level: 'line' },
    { text: 'Поновиться 20 серпня', confidence: 0.5, level: 'line' },
    { text: '2,49 USD >', confidence: 1.0, level: 'line' },
    { text: 'Варіанти', confidence: 1.0, level: 'line' },
    { text: '«One', confidence: 1.0, level: 'line' },
    { text: 'Apple One', confidence: 1.0, level: 'line' },
    { text: 'Отримайте більше з пакетом передплат.', confidence: 0.5, level: 'line' },
    { text: 'Користуйтеся Apple TV, Apple Music,', confidence: 0.5, level: 'line' },
    { text: 'Apple Arcade і не тільки за вигідною', confidence: 0.5, level: 'line' },
    { text: 'щомісячною ціною.', confidence: 0.5, level: 'line' },
    { text: 'Спробувати безкоштовно', confidence: 0.3, level: 'line' },
    { text: 'Керування сімейним доступом', confidence: 1.0, level: 'line' },
    { text: 'Електронні листи з', confidence: 0.5, level: 'line' },
    { text: 'підтвердженням поновлення', confidence: 1.0, level: 'line' },
    { text: 'Квитанцію буде надіслано щоразу, коли', confidence: 0.5, level: 'line' },
    { text: 'поновлюватиметься одна з ваших передплат. Квитанції', confidence: 0.5, level: 'line' },
  ],
};
