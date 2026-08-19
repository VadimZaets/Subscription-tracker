import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';

import { TAB_BAR_CLEARANCE } from '@/components/tabBar.constants';
import { strings } from '@/localization/strings';
import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

const STAGGER_DELAY_MS = 45;
const RISE_DISTANCE = 56;

// Без springify: пружина довго догойдувалась. Тут — виринули й одразу стали.
const OPTION_ENTERING = FadeInDown.duration(240)
  .easing(Easing.out(Easing.cubic))
  .withInitialValues({ opacity: 0, transform: [{ translateY: uScale(RISE_DISTANCE) }] });

type AddActionOverlayProps = { visible: boolean; onClose: () => void };

/** Рендериться з `tabBar`-пропа навігатора — тобто в тому самому дереві, що й таб-бар,
 *  але ПЕРЕД ним. Тому справжня кнопка «+» лишається поверх розмиття, без копій. */
export const AddActionOverlay = ({ visible, onClose }: AddActionOverlayProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const openConfirm = useCallback(
    (uri: string) => {
      onClose();
      router.push({ pathname: '/confirm', params: { uri } });
    },
    [onClose],
  );

  const handleCamera = useCallback(async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 1 });
    if (!result.canceled) openConfirm(result.assets[0].uri);
  }, [openConfirm]);

  const handleGallery = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 1 });
    if (!result.canceled) openConfirm(result.assets[0].uri);
  }, [openConfirm]);

  const handleManual = useCallback(() => {
    onClose();
    router.push('/add');
  }, [onClose]);

  if (!visible) return null;

  const options: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }[] = [
    { label: strings.action.camera, icon: 'camera', onPress: handleCamera },
    { label: strings.action.gallery, icon: 'images', onPress: handleGallery },
    { label: strings.action.manual, icon: 'create', onPress: handleManual },
  ];

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
        <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />
        <View style={styles.scrim} />
      </Pressable>

      <View style={styles.menu} pointerEvents="box-none">
        {options.map((option, index) => (
          <Animated.View
            key={option.label}
            entering={OPTION_ENTERING.delay(index * STAGGER_DELAY_MS)}
          >
            <Pressable onPress={option.onPress} style={styles.option}>
              <Text style={styles.optionLabel}>{option.label}</Text>
              <View style={styles.optionIcon}>
                <Ionicons name={option.icon} size={uScale(19)} color={colors.text} />
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'flex-end',
    },
    scrim: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.scrim,
    },
    menu: {
      alignItems: 'flex-end',
      paddingRight: uScale(24),
      paddingBottom: uScale(TAB_BAR_CLEARANCE),
      gap: uScale(16),
    },
    option: { flexDirection: 'row', alignItems: 'center', gap: uScale(14) },
    optionLabel: { fontFamily: fontFamilies.bold, fontSize: uFont(17), color: colors.text },
    optionIcon: {
      width: uScale(48),
      height: uScale(48),
      borderRadius: uScale(24),
      backgroundColor: colors.glassStrong,
      borderWidth: 1,
      borderColor: colors.borderGlass,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
