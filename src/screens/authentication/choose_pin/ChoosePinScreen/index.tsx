import React from 'react';
import { ScreenProps } from 'navigation/ScreenProps';
import { CHeader, CLayout } from 'components';
import { useNavigation } from '@react-navigation/native';
import ChoosePinRouter from 'navigation/ChoosePinNavigation/ChoosePinRouter';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import PinCodeWrapper from '../PinCodeWrapper';

const ChoosePinScreen: React.FC<
  // @ts-ignore
  ScreenProps<ChoosePinRouter.CHOOSE_PIN_SCREEN>
> = ({ route }) => {
  const { navigate } = useNavigation();
  const { phrases, algorithm } = route.params;

  const onFinishedEnterPin = (pin: string | undefined) => {
    navigate(AuthenticationRouter.INIT_ACCOUNT_SCREEN, {
      pin,
      phrases,
      algorithm,
    });
  };
  return (
    <CLayout>
      <CHeader title="" />
      <PinCodeWrapper
        status={'choose'}
        finishProcess={onFinishedEnterPin}
        //no need to store pin
        storePin={() => {}}
      />
    </CLayout>
  );
};

export default ChoosePinScreen;
