import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { CHeader, CLayout, Col } from 'components';
import { colors, fonts, textStyles } from 'assets';
import { scale } from 'device';
// @ts-ignore
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PIN_LENGTH } from 'utils/constants/key';

const ConfirmPinScreen: React.FC<
  // @ts-ignore
  ScreenProps<ChoosePinRouter.CONFIRM_PIN_SCREEN>
> = ({ route }) => {
  const { pin, phrases, algorithm } = route.params;
  const [pinConfirm, setPinConfirm] = useState<string>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  //const dispatch = useDispatch();

  const onTextChange = async (text: string) => {
    setPinConfirm(text);
    if (text && pin && pin === text) {
      if (pin && pin.length === PIN_LENGTH) {
        navigation.navigate(AuthenticationRouter.INIT_ACCOUNT_SCREEN, {
          pin,
          phrases,
          algorithm,
        });
      }
    }
  };

  return (
    <CLayout>
      <CHeader title={'Confirm PIN'} />
      <Col.C mt={78}>
        <Text style={styles.title}>Confirm security PIN</Text>
        <SmoothPinCodeInput
          placeholder={<View style={styles.pinPlaceholder} />}
          mask={
            <View
              style={[styles.pinPlaceholder, { backgroundColor: colors.R1 }]}
            />
          }
          maskDelay={500}
          password
          cellStyle={null}
          keyboardType={'number-pad'}
          autoFocus
          value={pinConfirm}
          codeLength={PIN_LENGTH}
          cellSpacing={0}
          restrictToNumbers
          cellStyleFocused={null}
          onTextChange={onTextChange}
          textStyle={styles.textStyle}
        />
        {!!pinConfirm &&
          !!pin &&
          pinConfirm.length === 6 &&
          pinConfirm !== pin && (
            <Text
              style={[
                styles.title,
                { color: colors.R1, marginTop: scale(20) },
              ]}>
              Incorrect PIN code
            </Text>
          )}
      </Col.C>
    </CLayout>
  );
};

export default ConfirmPinScreen;

const styles = StyleSheet.create({
  title: {
    ...textStyles.Body1,
    color: colors.c232635,
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  pinPlaceholder: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: colors.cFFFFFF,
    borderColor: colors.R1,
    borderWidth: scale(1),
  },
  textStyle: {
    color: colors.N1,
    fontSize: scale(20),
    fontFamily: fonts.Lato.regular,
  },
});
