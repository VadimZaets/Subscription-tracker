import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen, SCREEN_PADDING_H } from '@/components/Screen';
import { getSupportedOcrLanguages, OcrResult, recognizeText } from '@/ocr/recognizeText';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type Run = { label: string; ms: number; result: OcrResult };

const LANGUAGE_SETS: { label: string; languages: string[] }[] = [
  { label: 'uk', languages: ['uk'] },
  { label: 'en+ru', languages: ['en', 'ru'] },
];

const runOnce = async (uri: string, label: string, languages: string[]): Promise<Run> => {
  const startedAt = Date.now();
  const result = await recognizeText(uri, languages);
  return { label, ms: Date.now() - startedAt, result };
};

/** Викидний спайк-екран (Крок 2). Не для продакшена — тільки вимірювання точності OCR. */
export const OcrSpike = () => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [uri, setUri] = useState<string | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupportedOcrLanguages()
      .then((languages) => console.log('[ocr] supportedRecognitionLanguages:', languages))
      .catch((err) => console.log('[ocr] getSupportedLanguages failed:', err));
  }, []);

  const process = useCallback(async (pickedUri: string) => {
    setUri(pickedUri);
    setBusy(true);
    setError(null);
    setRuns([]);
    try {
      const results: Run[] = [];
      for (const set of LANGUAGE_SETS) {
        results.push(await runOnce(pickedUri, set.label, set.languages));
      }
      setRuns(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }, []);

  const pickFromLibrary = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const picked = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!picked.canceled) await process(picked.assets[0].uri);
  }, [process]);

  const pickFromCamera = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const picked = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!picked.canceled) await process(picked.assets[0].uri);
  }, [process]);

  if (!__DEV__) return null;

  return (
    <Screen>
      <Text style={styles.title}>OCR spike</Text>

      <View style={styles.actions}>
        <Pressable style={styles.actionBtn} onPress={pickFromLibrary}>
          <Text style={styles.actionLabel}>Галерея</Text>
        </Pressable>
        <Pressable style={styles.actionBtn} onPress={pickFromCamera}>
          <Text style={styles.actionLabel}>Камера</Text>
        </Pressable>
      </View>

      {uri ? <Image source={{ uri }} style={styles.preview} /> : null}
      {busy ? <ActivityIndicator color={colors.accent2} style={styles.spinner} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <ScrollView style={styles.results}>
        {runs.map((run) => (
          <View key={run.label} style={styles.runBlock}>
            <Text style={styles.runHeader}>
              {run.label} · {run.ms}ms · {run.result.blocks.length} рядків
            </Text>
            <Text style={styles.fullText}>{run.result.fullText}</Text>
            {run.result.blocks.map((block, index) => (
              <Text key={`${run.label}-${index}`} style={styles.blockLine}>
                [{block.confidence.toFixed(2)}] {block.text}
              </Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    title: { fontFamily: fontFamilies.extraBold, fontSize: uFont(22), color: colors.text },
    actions: { flexDirection: 'row', gap: uScale(10), marginTop: uScale(SCREEN_PADDING_H / 2) },
    actionBtn: {
      flex: 1,
      paddingVertical: uScale(14),
      borderRadius: uScale(14),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
    },
    actionLabel: { fontFamily: fontFamilies.bold, fontSize: uFont(14), color: colors.text },
    preview: {
      width: '100%',
      height: uScale(180),
      borderRadius: uScale(14),
      marginTop: uScale(14),
    },
    spinner: { marginTop: uScale(14) },
    error: {
      color: colors.red,
      fontFamily: fontFamilies.semiBold,
      fontSize: uFont(13),
      marginTop: uScale(10),
    },
    results: { flex: 1, marginTop: uScale(14) },
    runBlock: {
      marginBottom: uScale(18),
      paddingBottom: uScale(14),
      borderBottomWidth: 1,
      borderBottomColor: colors.borderGlass,
    },
    runHeader: { fontFamily: fontFamilies.bold, fontSize: uFont(13), color: colors.accent2 },
    fullText: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(12),
      color: colors.textDim,
      marginTop: uScale(6),
      marginBottom: uScale(6),
    },
    blockLine: { fontFamily: fontFamilies.medium, fontSize: uFont(11), color: colors.textFaint },
  });
