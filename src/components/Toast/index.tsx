import { colors } from 'assets';
import { scale } from 'device';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast, { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';

const styles = StyleSheet.create({
  text1: {
    fontSize: scale(12),
    fontWeight: '600',
  },
  text2: {
    fontSize: scale(10),
    color: colors.N2,
  },
  container: {
    paddingHorizontal: scale(16),
  },
});

const commonProps = {
  text1Style: styles.text1,
  text2NumberOfLines: 2,
  text2Style: styles.text2,
};

const toastConfig = {
  success: (props: BaseToastProps) => <BaseToast {...props} {...commonProps} style={{ borderLeftColor: colors.G1 }} />,
  error: (props: BaseToastProps) => <ErrorToast {...props} {...commonProps} style={{ borderLeftColor: colors.R1 }} />,
  warning: (props: BaseToastProps) => <BaseToast {...props} {...commonProps} style={{ borderLeftColor: colors.Y1 }} />,
};

export const ToastMessage = () => {
  const { top } = useSafeAreaInsets();
  return <Toast config={toastConfig} topOffset={top} />;
};
