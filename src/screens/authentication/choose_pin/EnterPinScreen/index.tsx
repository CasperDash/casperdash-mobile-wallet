import React, { useEffect, useState } from 'react';
import { CLayout } from 'components';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Config, Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import PinCodeWrapper from '../PinCodeWrapper';

const MAX_ATTEMPT = 5;

const EnterPinScreen = () => {
  const [pin, setPin] = useState<string>();
  const navigation = useNavigation<StackNavigationProp<any>>();

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

  return (
    <CLayout>
      <PinCodeWrapper
        status="enter"
        finishProcess={onFinishedEnterPin}
        storedPin={pin}
        timeLocked={__DEV__ ? 20000 : undefined}
        maxAttempts={MAX_ATTEMPT}
        delayBetweenAttempts={1000}
      />
    </CLayout>
  );
};

export default EnterPinScreen;
