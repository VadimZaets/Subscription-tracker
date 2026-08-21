import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type ConfirmSheetProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Червона (руйнівна) дія за замовчуванням — видалення/скасування. */
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/** Кастомний попап питання "так/ні" у стилі застосунку — той самий bottom-sheet
 *  підхід, що й у date-picker'і Confirm.tsx, замість нативного Alert. */
export const ConfirmSheet = ({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onCancel}>
      <Animated.View
        style={styles.scrim}
        entering={FadeIn.duration(180)}
        exiting={FadeOut.duration(180)}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onCancel} />
      </Animated.View>
      <Animated.View
        style={styles.sheet}
        entering={SlideInDown.duration(220)}
        exiting={SlideOutDown.duration(200)}
      >
        <View style={styles.grabber} />
        <Text style={styles.title}>{title}</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}

        <Pressable
          onPress={onConfirm}
          style={[styles.btn, destructive ? styles.btnDestructive : styles.btnAccent]}
        >
          <Text style={[styles.btnLabel, destructive && styles.btnLabelDestructive]}>
            {confirmLabel}
          </Text>
        </Pressable>
        <Pressable onPress={onCancel} style={styles.cancelBtn}>
          <Text style={styles.cancelLabel}>{cancelLabel}</Text>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    scrim: { flex: 1, backgroundColor: colors.scrim },
    sheet: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: colors.bg,
      borderTopLeftRadius: uScale(24),
      borderTopRightRadius: uScale(24),
      borderWidth: 1,
      borderColor: colors.borderGlass,
      padding: uScale(20),
      paddingBottom: uScale(36),
      alignItems: 'center',
    },
    grabber: {
      width: uScale(36),
      height: uScale(4),
      borderRadius: uScale(3),
      backgroundColor: colors.borderGlass,
      marginBottom: uScale(16),
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(17),
      color: colors.text,
      textAlign: 'center',
    },
    message: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(13.5),
      lineHeight: uFont(19),
      color: colors.textDim,
      textAlign: 'center',
      marginTop: uScale(8),
      maxWidth: uScale(280),
    },
    btn: {
      alignSelf: 'stretch',
      borderRadius: uScale(100),
      paddingVertical: uScale(15),
      alignItems: 'center',
      marginTop: uScale(20),
    },
    btnAccent: { backgroundColor: colors.accent },
    btnDestructive: { backgroundColor: `${colors.red}24`, borderWidth: 1, borderColor: colors.red },
    btnLabel: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.onAccent },
    btnLabelDestructive: { color: colors.red },
    cancelBtn: { marginTop: uScale(14) },
    cancelLabel: { fontFamily: fontFamilies.bold, fontSize: uFont(13.5), color: colors.textFaint },
  });
