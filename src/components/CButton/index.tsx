import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Alert,
  StyleSheet,
} from 'react-native';

const defaultProps = {
  /*eslint no-alert: "off"*/
  onPress: () => console.log('KIEM TRA'),
};

interface Props extends React.FC<TouchableOpacityProps> {
  enabledOpacity?: boolean;
  disabled?: boolean;
  style?: any;
  children?: any;
}

const Button = ({
  disabled,
  style,
  enabledOpacity = false,
  children,
  ...rest
}: Props) => {
  return (
    <TouchableOpacity
      {...rest}
      {...{ disabled }}
      activeOpacity={0.85}
      style={[style, disabled && !enabledOpacity && styles.disabled]}>
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
