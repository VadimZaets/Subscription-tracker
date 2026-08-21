import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useEffect, useMemo, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

/** Кастомний попап питання "так/ні" у стилі застосунку — нативний bottom-sheet
 *  (react-native-true-sheet), керований декларативним пропом `visible`. */
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
  const sheet = useRef<TrueSheet>(null);
  const dismissedByUser = useRef(false);

  useEffect(() => {
    if (visible) {
      dismissedByUser.current = false;
      sheet.current?.present();
    } else {
      sheet.current?.dismiss();
    }
  }, [visible]);

  const handleDidDismiss = () => {
    if (visible) onCancel();
  };

  return (
    <TrueSheet
      ref={sheet}
      detents={['auto']}
      cornerRadius={uScale(24)}
      backgroundColor={colors.bg}
      grabber={false}
      onDidDismiss={handleDidDismiss}
    >
      <View style={styles.sheet}>
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
      </View>
    </TrueSheet>
  );
};

const makeStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    sheet: {
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
