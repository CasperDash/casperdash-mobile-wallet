import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';

const defaultProps = {
  onPress: () => console.info('onPress'),
};

interface Props extends React.FC<TouchableOpacityProps> {
  enabledOpacity?: boolean;
  disabled?: boolean;
  style?: any;
  children?: any;
  hitSlop?: any;
}

const Button = ({ disabled, style, enabledOpacity = false, children, hitSlop, ...rest }: Props) => {
  return (
    <TouchableOpacity
      hitSlop={hitSlop}
      {...rest}
      {...{ disabled }}
      activeOpacity={0.85}
      style={[style, disabled && !enabledOpacity && styles.disabled]}
    >
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
