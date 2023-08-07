import React from 'react';

import { useNavigation } from '@react-navigation/native';

import { CHeader, CLayout } from 'components';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import { ScreenProps } from 'navigation/ScreenProps';
import { createAndStoreMasterPassword } from 'utils/helpers/account';

import PinCodeWrapper from '../PinCodeWrapper';

const ChoosePinScreen: React.FC<
  // @ts-ignore
  ScreenProps<ChoosePinRouter.CHOOSE_PIN_SCREEN>
> = ({ route }) => {
  const { navigate } = useNavigation();
  const { phrases, algorithm, derivationPath } = route.params;

  const onFinishedEnterPin = () => {
    navigate(AuthenticationRouter.INIT_ACCOUNT_SCREEN, {
      phrases,
      algorithm,
      derivationPath,
    });
  };
  return (
    <CLayout>
      <CHeader title="" />
      <PinCodeWrapper
        status={'choose'}
        finishProcess={onFinishedEnterPin}
        //no need to store pin
        storePin={(pin: string) => {
          createAndStoreMasterPassword(pin);
        }}
        timeLocked={__DEV__ ? 20000 : undefined}
      />
    </CLayout>
  );
};

export default ChoosePinScreen;
