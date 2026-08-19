import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { fontFamilies, ThemeColors, useTheme } from '@/theme';
import { uFont, uScale } from '@/utils/uScale';

type NotificationsPrimingSheetProps = {
  visible: boolean;
  onAllow: () => void;
  onDismiss: () => void;
};

// Прайминг-екран перед системним запитом дозволу на сповіщення (Крок 3 підключає
// реальний тригер: показати один раз, після value-моменту, перед першим
// Notifications.scheduleNotificationAsync).
export const NotificationsPrimingSheet = ({
  visible,
  onAllow,
  onDismiss,
}: NotificationsPrimingSheetProps) => {
  const { colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.scrim} onPress={onDismiss} />
      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <LinearGradient colors={[colors.accent, colors.accent2]} style={styles.icon}>
          <Ionicons name="notifications" size={uScale(28)} color="#fff" />
        </LinearGradient>
        <Text style={styles.title}>Не пропусти жодне списання</Text>
        <Text style={styles.sub}>
          Ми нагадаємо за кілька днів до оплати й попередимо, якщо ціна зміниться. Вимкнеш будь-коли
          в налаштуваннях.
        </Text>
        <Pressable onPress={onAllow}>
          <LinearGradient colors={[colors.accent, colors.accent2]} style={styles.allowBtn}>
            <Text style={styles.allowText}>Дозволити сповіщення</Text>
          </LinearGradient>
        </Pressable>
        <Pressable onPress={onDismiss}>
          <Text style={styles.dismiss}>Не зараз</Text>
        </Pressable>
      </View>
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
      padding: uScale(24),
      paddingBottom: uScale(36),
      alignItems: 'center',
    },
    grabber: {
      width: uScale(36),
      height: uScale(4),
      borderRadius: uScale(3),
      backgroundColor: colors.borderGlass,
      marginBottom: uScale(20),
    },
    icon: {
      width: uScale(64),
      height: uScale(64),
      borderRadius: uScale(18),
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: uScale(18),
    },
    title: {
      fontFamily: fontFamilies.extraBold,
      fontSize: uFont(19),
      color: colors.text,
      marginBottom: uScale(9),
    },
    sub: {
      fontFamily: fontFamilies.medium,
      fontSize: uFont(13.5),
      lineHeight: uFont(20),
      color: colors.textDim,
      textAlign: 'center',
      marginBottom: uScale(22),
      maxWidth: uScale(280),
    },
    allowBtn: {
      borderRadius: uScale(100),
      paddingHorizontal: uScale(40),
      paddingVertical: uScale(15),
    },
    allowText: { fontFamily: fontFamilies.bold, fontSize: uFont(14.5), color: colors.onAccent },
    dismiss: {
      fontFamily: fontFamilies.bold,
      fontSize: uFont(13.5),
      color: colors.textFaint,
      marginTop: uScale(14),
    },
  });
