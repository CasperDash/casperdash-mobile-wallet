import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { colors, textStyles } from 'assets';
import { scale } from 'device';

interface Props {
  text?: string;
  disabled?: boolean;
  style?: any;
  icon?: any;
  textStyle?: any;
  type?: 'default' | 'line';
  variant?: 'primary' | 'secondary';
}

const defaultProps = {
  onPress: () => console.log('pressed'),
};

const CTextButton = ({
  disabled = false,
  style,
  icon,
  text,
  textStyle,
  type = 'default',
  variant = 'primary',
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      {...rest}
      {...{ disabled }}
      activeOpacity={0.85}
      style={[
        styles.button,
        type === 'line' && (variant === 'secondary' ? styles.border : styles.borderPrimary),
        style,
        disabled && styles.disabled,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.title,
          textStyle,
          type === 'line' && (variant === 'secondary' ? styles.textBorder : styles.textBorderPrimary),
          disabled && styles.textDisabled,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    backgroundColor: colors.N4,
    borderWidth: 0,
  },
  button: {
    width: scale(343),
    height: scale(44),
    paddingHorizontal: scale(16),
    borderRadius: scale(90),
    backgroundColor: colors.R1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...textStyles.Sub1,
    fontSize: scale(16),
    color: colors.W1,
  },
  textDisabled: {
    color: colors.N2,
  },
  border: {
    borderWidth: scale(1),
    borderColor: colors.N3,
    backgroundColor: colors.W1,
  },
  borderPrimary: {
    borderWidth: scale(1),
    borderColor: colors.R1,
    backgroundColor: colors.W1,
  },
  textBorder: {
    color: colors.N3,
  },
  textBorderPrimary: {
    color: colors.R1,
  },
});

CTextButton.defaultProps = defaultProps;

export default CTextButton;
