import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import { CHeader, CLayout, Col } from 'components';
import { colors, fonts, textStyles } from 'assets';
import { scale } from 'device';
// @ts-ignore
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import { useNavigation } from '@react-navigation/native';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';

const ChoosePinScreen: React.FC<
  // @ts-ignore
  ScreenProps<ChoosePinRouter.CHOOSE_PIN_SCREEN>
> = ({ route }) => {
  const [pin, setPin] = useState<string>();
  const pinLength = 6;
  const { navigate } = useNavigation();
  const { showBack, phrases } = route.params;

  useEffect(() => {
    if (pin && pin.length === pinLength) {
      navigate(ChoosePinRouter.CONFIRM_PIN_SCREEN, { pin, phrases });
    }
  }, [pin]);

  return (
    <CLayout>
      <CHeader title={'Choose PIN'} showBack={showBack} />
      <Col.C mt={78}>
        <Text style={styles.title}>Input security PIN</Text>
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
          autoFocus
          keyboardType={'number-pad'}
          value={pin}
          codeLength={pinLength}
          cellSpacing={0}
          restrictToNumbers
          cellStyleFocused={null}
          onTextChange={setPin}
          textStyle={styles.textStyle}
        />
      </Col.C>
    </CLayout>
  );
};

export default ChoosePinScreen;

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
