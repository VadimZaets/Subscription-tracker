import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Path, Svg } from 'react-native-svg';

import { ANALYZER_ICONS } from '@/assets/icon/analyzer';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const HOLD_MS = 900;
const SLIDE_MS = 260;
const STEP_INTERVAL_MS = 1900;
const CIRCLE_SIZE = 180;
const ICON_SIZE = 88;
const CHECK_SIZE = 56;
// Довжина шляху "M20 6L9 17L4 12" (24×24 viewBox): √242 + √50 ≈ 22.6,
// округлено з запасом — для stroke-dasharray/dashoffset ефекту "малювання".
const CHECK_PATH_LENGTH = 24;
const CHECK_DRAW_MS = 380;

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Наступний випадковий індекс, який гарантовано відрізняється від поточного —
 *  щоб лого в крузі реально «мигтіло» різними брендами, а не інколи повторювалось. */
const nextRandomIndex = (length: number, current: number) => {
  if (length <= 1) return 0;
  let next = current;
  while (next === current) {
    next = Math.floor(Math.random() * length);
  }
  return next;
};

type AnalyzingLoaderProps = { done: boolean };

/** Лоадер розпізнавання фото: круг із лого відомих сервісів, що йдуть одна за
 *  одною як кадри кіноплівки — поточна ховається в один бік, наступна виїжджає
 *  з протилежного, напрям рухів обирається випадково щоразу. Текст знизу йде
 *  по кроках. Коли АНАЛІЗ готовий (`done`), не обривається різко — показує
 *  "Готово!" і зелену галочку, а сам компонент ховає батько (Confirm) плавним
 *  fade-out уже після цього. */
export const AnalyzingLoader = ({ done }: AnalyzingLoaderProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  // Випадковий старт — інакше при кожному відкритті екрана перша іконка
  // завжди та сама (Claude), і це сприймається як «повторення».
  const [iconIndex, setIconIndex] = useState(() =>
    Math.floor(Math.random() * ANALYZER_ICONS.length),
  );
  const [stepIndex, setStepIndex] = useState(0);
  const translateX = useSharedValue(0);
  const checkDraw = useSharedValue(0);
  const circlePx = uScale(CIRCLE_SIZE);

  useEffect(() => {
    if (done) {
      checkDraw.value = withTiming(1, {
        duration: CHECK_DRAW_MS,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [done, checkDraw]);

  useEffect(() => {
    if (done) return;
    let holdTimer: ReturnType<typeof setTimeout>;
    let slideTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    // Плівковий цикл: пауза (кадр видно) → стара іконка виїжджає за край →
    // миттєвий "стрибок" нової на протилежний край (за межами круга, непомітно)
    // → нова в'їжджає до центру → пауза знову. Напрям (dir) — випадковий щоразу.
    const runCycle = () => {
      holdTimer = setTimeout(() => {
        if (cancelled) return;
        const dir = Math.random() < 0.5 ? 1 : -1;
        translateX.value = withTiming(-dir * circlePx, {
          duration: SLIDE_MS,
          easing: Easing.in(Easing.cubic),
        });

        slideTimer = setTimeout(() => {
          if (cancelled) return;
          setIconIndex((current) => nextRandomIndex(ANALYZER_ICONS.length, current));
          translateX.value = dir * circlePx;
          translateX.value = withTiming(0, {
            duration: SLIDE_MS,
            easing: Easing.out(Easing.cubic),
          });
          runCycle();
        }, SLIDE_MS);
      }, HOLD_MS);
    };

    runCycle();
    return () => {
      cancelled = true;
      clearTimeout(holdTimer);
      clearTimeout(slideTimer);
    };
  }, [done, circlePx, translateX]);

  useEffect(() => {
    if (done) return;
    const steps = strings.confirm.analyzingSteps;
    const timer = setInterval(() => {
      setStepIndex((current) => (current + 1) % steps.length);
    }, STEP_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [done]);

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const checkAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK_PATH_LENGTH * (1 - checkDraw.value),
  }));

  const stepText = done ? strings.confirm.analyzingDone : strings.confirm.analyzingSteps[stepIndex];
  const CurrentIcon = ANALYZER_ICONS[iconIndex];

  return (
    <View style={styles.wrap}>
      <View style={styles.circle}>
        {done ? (
          <Svg width={uScale(CHECK_SIZE)} height={uScale(CHECK_SIZE)} viewBox="0 0 24 24">
            <AnimatedPath
              d="M20 6L9 17L4 12"
              stroke="#FFFFFF"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={CHECK_PATH_LENGTH}
              animatedProps={checkAnimatedProps}
            />
          </Svg>
        ) : (
          <Animated.View style={[styles.iconFace, slideStyle]}>
            <CurrentIcon width={uScale(ICON_SIZE)} height={uScale(ICON_SIZE)} color={colors.text} />
          </Animated.View>
        )}
      </View>

      <View style={styles.textRow}>
        <Text style={styles.stepText}>{stepText}</Text>
      </View>
    </View>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    wrap: { flex: 1, alignItems: 'center' },
    textRow: { alignItems: 'center', marginTop: uScale(32) },
    circle: {
      marginTop: uScale(48),
      width: uScale(CIRCLE_SIZE),
      height: uScale(CIRCLE_SIZE),
      borderRadius: uScale(999),
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    iconFace: { alignItems: 'center', justifyContent: 'center' },
    stepText: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(17),
      color: colors.text,
      textAlign: 'center',
      paddingHorizontal: uScale(32),
    },
  });
