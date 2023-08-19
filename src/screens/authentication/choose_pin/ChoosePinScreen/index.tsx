import React from 'react';
import { ScreenProps } from 'navigation/ScreenProps';
import { CHeader, CLayout } from 'components';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { createAndStoreMasterPassword } from 'utils/helpers/account';
import PinCodeWrapper from '../PinCodeWrapper';
import { useStackNavigation } from 'utils/hooks/useNavigation';

const ChoosePinScreen: React.FC<
  // @ts-ignore
  ScreenProps<ChoosePinRouter.CHOOSE_PIN_SCREEN>
> = ({ route }) => {
  const { navigate } = useStackNavigation();
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
