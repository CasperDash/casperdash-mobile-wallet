import React, { useEffect } from 'react';
import { View } from 'react-native';

import Splash from 'react-native-splash-screen';
import { Config, Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { isEmpty } from 'lodash';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

const SplashScreen = () => {
  const reStack = useRestack();
  const dispatch = useDispatch();

  useEffect(() => {
    //always get new config
    dispatch(allActions.main.getConfigurations());
    setupNavigation();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupNavigation = async () => {
    const overview = await Config.getItem(Keys.overview);

    const casperDashInfo = await Config.getItem(Keys.casperdash);

    let screen = AuthenticationRouter.WELCOME_SCREEN;
    if (overview === 1 && !casperDashInfo) {
      screen = AuthenticationRouter.CREATE_NEW_WALLET;
    }

    if (!isEmpty(casperDashInfo)) {
      screen = AuthenticationRouter.ENTER_PIN;
    }

    reStack(StackName.AuthenticationStack, screen);
    Splash.hide();
  };

  return <View />;
};

export default SplashScreen;
