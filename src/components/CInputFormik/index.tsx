import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  UIManager,
  LayoutAnimation,
  ReturnKeyTypeOptions,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

import { colors, fonts } from 'assets';
import { scale } from 'device';

type Props = {
  placeholder?: string;
  rightComponent?: any;
  secureTextEntry?: boolean;
  editable?: boolean;
  onPress?: () => void;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only' | undefined;
  multiline?: boolean;
  maxLength?: number;
  keyboard?: boolean;
  keyboardType?: any;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  inputStyle?: StyleProp<ViewStyle> | TextStyle | undefined;
  label?: string;
  labelStyle?: StyleProp<ViewStyle> | TextStyle | undefined;
  placeholderTextColor?: string;
  onBlur?: () => void;
  onFocus?: () => void;
  style?: StyleProp<ViewStyle> | TextStyle | undefined;
  values?: { [key: string]: any };
  errors?: { [key: string]: any };
  touched?: { [key: string]: any };
  handleBlur?: any;
  handleChange?: any;
  name: string;
};

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CInput = forwardRef((props: Props, ref): any => {
  const {
    rightComponent,
    secureTextEntry,
    editable = true,
    containerStyle,
    inputStyle,
    pointerEvents,
    multiline,
    maxLength,
    keyboardType = 'default',
    onSubmitEditing,
    returnKeyType,
    label,
    labelStyle,
    placeholder,
    placeholderTextColor = colors.cB2B2B2,
    onFocus,
    onBlur,
    style,
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    name,
    ...rest
  } = props;

  const inputRef = useRef<any>();
  const inputValue = useRef<any>();

  useImperativeHandle(ref, () => ({
    focus: () => focus(true),
    blur: () => blur(true),
    clear: clear,
    setText: setText,
    value: value,
  }));

  const focus = (curRef: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onFocus && onFocus();
    if (curRef) {
      inputRef.current.focus();
    }
  };
  const blur = (curRef: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onBlur && onBlur();
    if (curRef) {
      inputRef.current.blur();
    }
  };

  const clear = () => {
    inputValue.current = null;
    inputRef.current.clear();
  };

  const setText = (text: string) => {
    inputValue.current = text;
    inputRef.current?.setNativeProps({ text: text });
  };

  const value = () => {
    return inputValue.current;
  };

  return (
    <View style={[styles.container, style]}>
      {!!label && (
        <Text numberOfLines={1} style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      <View style={[styles.row, containerStyle]}>
        <TextInput
          {...rest}
          allowFontScaling={false}
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          style={[styles.input, multiline == true ? styles.inputMultiple : { height: scale(48) }, inputStyle]}
          value={values && values[name] ? values[name].toString() : ''}
          onFocus={focus}
          onBlur={handleBlur(name)}
          onChangeText={handleChange(name)}
          secureTextEntry={secureTextEntry}
          editable={editable}
          pointerEvents={!editable ? 'none' : pointerEvents}
          multiline={multiline}
          maxLength={maxLength}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
        />
        {rightComponent}
      </View>
      {errors && touched && errors[name] && touched[name] ? <Text style={styles.error}>{errors[name]}</Text> : null}
    </View>
  );
});

export default CInput;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.cB2B2B2,
    borderRadius: scale(5),
    borderWidth: scale(1),
  },
  title: {
    fontSize: scale(12),
    fontFamily: fonts.Poppins.regular,
    color: colors.c000000,
  },
  input: {
    height: scale(48),
    flex: 1,
    fontFamily: fonts.Poppins.regular,
    color: colors.c000000,
    paddingVertical: 0,
    fontSize: scale(18),
    textAlignVertical: 'center',
    paddingHorizontal: scale(16),
  },
  label: {
    fontFamily: fonts.Poppins.regular,
    color: colors.cB2B2B2,
    fontSize: scale(14),
    marginBottom: scale(4),
  },
  inputMultiple: {
    height: scale(94),
    justifyContent: 'flex-start',
    paddingTop: scale(8),
    paddingBottom: scale(8),
    textAlignVertical: 'top',
  },
  error: {
    color: colors.R3,
    fontSize: scale(12),
    marginTop: scale(12),
    fontWeight: '400',
    fontFamily: fonts.Poppins.regular,
  },
});
