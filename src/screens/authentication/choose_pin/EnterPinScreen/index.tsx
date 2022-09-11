import React, { useEffect, useState, useCallback } from 'react';
import { CLayout } from 'components';
import { Image } from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Config, Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import PinCodeWrapper from '../PinCodeWrapper';
import { images } from 'assets';
import { CButton } from 'components';
import useBiometry, { BiometryType } from 'utils/hooks/useBiometry';
import { scale } from 'device';

const MAX_ATTEMPT = 5;

const EnterPinScreen = () => {
  const [pin, setPin] = useState<string>();
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isBiometryEnabled, biometryType } = useBiometry();

  useEffect(() => {
    Config.getItem(Keys.pinCode).then((savedPin: string) => {
      setPin(savedPin);
    });
  }, []);

  const onFinishedEnterPin = () => {
    navigation.navigate(AuthenticationRouter.INIT_ACCOUNT_SCREEN, {
      isLoadUser: true,
    });
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
        storedPin={pin}
        timeLocked={__DEV__ ? 20000 : undefined}
        maxAttempts={MAX_ATTEMPT}
        delayBetweenAttempts={1000}
        bottomLeftComponent={touchIdButton}
      />
    </CLayout>
  );
};

export default EnterPinScreen;
