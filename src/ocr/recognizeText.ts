import ReactNativeTextRecognition from '@dariyd/react-native-text-recognition';

export type OcrBlock = {
  text: string;
  confidence: number;
  level: 'word' | 'line' | 'block';
};

export type OcrResult = {
  blocks: OcrBlock[];
  fullText: string;
};

/**
 * Єдина точка входу в OCR. Ніщо поза src/ocr/ не імпортує вендорний пакет напряму —
 * заміна реалізації (ML Kit / власний Expo-модуль) зводиться до зміни цього файлу.
 */
export const recognizeText = async (uri: string, languages?: string[]): Promise<OcrResult> => {
  const result = await ReactNativeTextRecognition.recognizeText(uri, {
    recognitionLevel: 'line',
    languages,
  });

  if (!result.success || result.error) {
    throw new Error(result.errorMessage ?? 'OCR recognition failed');
  }

  const page = result.pages?.[0];

  return {
    blocks: (page?.elements ?? []).map((element) => ({
      text: element.text,
      confidence: element.confidence,
      level: element.level,
    })),
    fullText: result.fullText ?? page?.fullText ?? '',
  };
};

export const getSupportedOcrLanguages = (): Promise<string[]> =>
  ReactNativeTextRecognition.getSupportedLanguages();
