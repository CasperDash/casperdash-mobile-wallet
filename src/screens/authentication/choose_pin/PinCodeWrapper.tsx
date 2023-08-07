import React from 'react';
import { StyleSheet } from 'react-native';

import PINCode, { IProps } from '@haskkor/react-native-pincode';

import { colors } from 'assets';
import { CLayout } from 'components';
import { scale } from 'device';
// @ts-ignore
import { PIN_LENGTH } from 'utils/constants/key';

const PinCodeWrapper = (props: Partial<IProps>) => {
  return (
    <CLayout>
      <PINCode
        passwordLength={PIN_LENGTH}
        stylePinCodeCircle={styles.pinPlaceholder}
        styleLockScreenViewCloseButton={styles.button}
        delayBetweenAttempts={1000}
        colorPasswordEmpty={colors.cFFFFFF}
        colorPassword={colors.R1}
        stylePinCodeButtonNumberPressed={colors.R1}
        stylePinCodeButtonCircle={styles.stylePinCodeCircle}
        alphabetCharsVisible={true}
        stylePinCodeColorTitle={colors.N1}
        stylePinCodeButtonNumber={colors.N1}
        touchIDDisabled={true}
        {...props}
      />
    </CLayout>
  );
};

export default PinCodeWrapper;

const styles = StyleSheet.create({
  pinPlaceholder: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    borderColor: colors.R1,
    borderWidth: scale(1),
  },
  stylePinCodeCircle: {
    backgroundColor: colors.cFFFFFF,
  },
  button: {
    display: 'none',
  },
});
