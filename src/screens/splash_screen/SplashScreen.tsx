import React, { useEffect } from 'react';
import { View } from 'react-native';

import Splash from 'react-native-splash-screen';
import { Config, Keys } from 'utils';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const reStack = useRestack();

  useEffect(() => {
    setupNavigation();
  }, []);

  const setupNavigation = async () => {
    const overview = await Config.getItem(Keys.overview);
    const pinCode = await Config.getItem(Keys.pinCode);
    const user = await Config.getItem(Keys.casperdash);

    let screen = AuthenticationRouter.WELCOME_SCREEN;
    if (overview === 1 || !user) {
      screen = AuthenticationRouter.CREATE_NEW_WALLET;
    }

    if (!isEmpty(pinCode)) {
      screen = AuthenticationRouter.ENTER_PIN;
    }

    if (user && user.casperdash && user.casperdash.publicKey) {
      dispatch(allActions.nft.fetchNFTInfo(user.casperdash.publicKey));
    }
    reStack(StackName.AuthenticationStack, screen);
    Splash.hide();
  };

  return <View />;
};

export default SplashScreen;
