import React, { useCallback, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import Splash from 'react-native-splash-screen';
import { Config, Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { isEmpty } from 'lodash';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';
import { createAndStoreMasterPassword } from 'utils/helpers/account';
import { useConfigurations } from 'utils/hooks/useConfigurations';

const SplashScreen = () => {
  const reStack = useRestack();

  const { isLoading } = useConfigurations();

  const setupNavigation = useCallback(async () => {
    const overview = await Config.getItem(Keys.overview);

    const casperDashInfo = await Config.getItem(Keys.casperdash);
    const legacyPin = await Config.getItem(Keys.pinCode);
    if (legacyPin) {
      await createAndStoreMasterPassword(legacyPin);
    }

    let screen = AuthenticationRouter.WELCOME_SCREEN;
    if (overview === 1 && !casperDashInfo) {
      screen = AuthenticationRouter.CREATE_NEW_WALLET;
    }

    if (!isEmpty(casperDashInfo)) {
      screen = AuthenticationRouter.ENTER_PIN;
    }

    reStack(StackName.AuthenticationStack, screen);
    Splash.hide();
  }, [reStack]);

  useEffect(() => {
    setupNavigation();
  }, [setupNavigation]);

  return isLoading ? <ActivityIndicator /> : <View />;
};

export default SplashScreen;
