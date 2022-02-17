import React, { useEffect } from 'react';
import { View } from 'react-native';

import Splash from 'react-native-splash-screen';
import { Config, Keys } from 'utils';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import { fetchNFTInfo } from 'redux_manager/nft/nft_action';

const SplashScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<StackNavigationProp<any>>();

  useEffect(() => {
    setupNavigation();
  }, []);

  const setupNavigation = async () => {
    const overview = await Config.getItem(Keys.overview);
    const pinCode = await Config.getItem(Keys.pinCode);
    const casperdash = await Config.getItem(Keys.casperdash);

    let screen = AuthenticationRouter.WELCOME_SCREEN;

    if (overview === 1) {
      screen = AuthenticationRouter.CREATE_NEW_WALLET;
    }
    if (!isEmpty(pinCode)) {
      screen = AuthenticationRouter.ENTER_PIN;
    }
    if (casperdash && casperdash.publicKey) {
      dispatch(fetchNFTInfo(casperdash.publicKey));
    }
    navigation.dispatch(
      CommonActions.reset({
        routes: [
          {
            name: 'AuthenticationStack',
            state: {
              routes: [
                {
                  name: screen,
                },
              ],
            },
          },
        ],
      }),
    );
    Splash.hide();
  };

  return <View />;
};

export default SplashScreen;
