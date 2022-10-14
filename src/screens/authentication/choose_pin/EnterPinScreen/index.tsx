import React, { useCallback, useState } from 'react';
import { CLayout, CButton } from 'components';
import { Image } from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import PinCodeWrapper from '../PinCodeWrapper';
import { images } from 'assets';
import useBiometry, { BiometryType } from 'utils/hooks/useBiometry';
import { scale } from 'device';
import { getUserFromStorage } from 'utils/helpers/account';

const MAX_ATTEMPT = 5;

const EnterPinScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isBiometryEnabled, biometryType } = useBiometry();
  const [pin, setPin] = useState<string>();

  const onFinishedEnterPin = () => {
    navigation.navigate(AuthenticationRouter.INIT_ACCOUNT_SCREEN, {
      isLoadUser: true,
      pin,
    });
  };

  const validatePin = async (pinCode?: string) => {
    if (pinCode) {
      setPin(pinCode);
      const user = await getUserFromStorage(pinCode);
      if (user) {
        return true;
      }
      return false;
    }
    return false;
  };

  const touchIdButton = useCallback(
    (launchTouchID: () => void) => {
      return (
        <>
          {biometryType && isBiometryEnabled && (
            <CButton onPress={launchTouchID}>
              <Image
                style={{
                  marginLeft: scale(16),
                  width: scale(40),
                  height: scale(40),
                }}
                source={
                  biometryType === BiometryType.FaceID
                    ? images.faceId
                    : images.touchId
                }
              />
            </CButton>
          )}
        </>
      );
    },
    [biometryType, isBiometryEnabled],
  );

  return (
    <CLayout>
      <PinCodeWrapper
        status="enter"
        finishProcess={onFinishedEnterPin}
        timeLocked={__DEV__ ? 20000 : undefined}
        maxAttempts={MAX_ATTEMPT}
        delayBetweenAttempts={1000}
        bottomLeftComponent={touchIdButton}
        handleResultEnterPin={validatePin}
      />
    </CLayout>
  );
};

export default EnterPinScreen;
