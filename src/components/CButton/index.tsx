import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, Alert, StyleSheet } from 'react-native';

const defaultProps = {
  /*eslint no-alert: "off"*/
  onPress: () => console.log('KIEM TRA'),
};

const Button: React.FC<TouchableOpacityProps> = ({ disabled, style, children, ...rest }) => {
  return (
    <TouchableOpacity {...rest} {...{ disabled }} activeOpacity={0.85} style={[style, disabled && styles.disabled]}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});

Button.defaultProps = defaultProps;
export default Button;
