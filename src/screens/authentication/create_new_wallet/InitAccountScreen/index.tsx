import React, { useCallback, useEffect } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import { CLayout, Col } from 'components';
import { colors, fonts, textStyles } from 'assets';
import { scale } from 'device';
// @ts-ignore
import { CommonActions, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Config, Keys } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { IWallet } from 'casper-storage';
import { WalletDescriptor } from 'casper-storage/dist/tsc/user/wallet-info';
import { IHDKey } from 'casper-storage/src/bips/bip32';
import { CONNECTION_TYPES, WalletType } from 'utils/constants/settings';
import { createNewUserWithHdWallet } from 'utils/helpers/account';
import { images } from 'assets';
import { getUser } from 'utils/selectors/user';

const InitAccountScreen: React.FC<
  // @ts-ignore
  ScreenProps<CreateNewWalletRouter.INIT_ACCOUNT_SCREEN>
> = ({ route }) => {
  const { pin, phrases, algorithm, isLoadUser } = route.params;
  const navigation = useNavigation<StackNavigationProp<any>>();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUser);

  const setupUser = useCallback(async () => {
    try {
      const user = createNewUserWithHdWallet(pin, phrases, algorithm);
      const acc0: IWallet<IHDKey> = await user.getWalletAccount(0);
      user.setWalletInfo(
        acc0.getReferenceKey(),
        new WalletDescriptor('Account 1'),
      );
      const publicKey = await acc0.getPublicKey();
      const hashingOptions = user.getPasswordHashingOptions();
      const userInfo = user.serialize();
      const info = {
        publicKey: publicKey,
        loginOptions: {
          connectionType: CONNECTION_TYPES.passPhase,
          hashingOptions: hashingOptions,
        },
        userInfo: userInfo,
      };
      await Config.saveItem(Keys.casperdash, info);
      await Config.saveItem(Keys.pinCode, pin);

      const wallets = user.getHDWallet()?.derivedWallets || [];
      const selectedWallet = wallets[0];
      const selectedWalletDetails = {
        walletInfo: selectedWallet,
        publicKey,
        walletType: WalletType.HDWallet,
      };
      await Config.saveItem(Keys.selectedWallet, selectedWalletDetails);
      dispatch(allActions.user.getUserSuccess(user));
      dispatch(allActions.user.getSelectedWalletSuccess(selectedWalletDetails));
    } catch (e: any) {
      const message = {
        message: e && e.message ? e.message : 'Error',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message, 10000));
    }
  }, [algorithm, dispatch, phrases, pin]);

  const loadUser = useCallback(() => {
    if (!currentUser) {
      dispatch(allActions.main.initState());
    }
  }, [dispatch, currentUser]);

  const onInitSuccess = useCallback(() => {
    if (currentUser) {
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: 'MainStack',
            },
          ],
        }),
      );
      dispatch(allActions.main.loadLocalStorage());
      const message = {
        message: 'Logged in successfully',
        type: MessageType.success,
      };
      dispatch(allActions.main.showMessage(message, 1000));
    }
  }, [dispatch, navigation, currentUser]);

  useEffect(() => {
    //Need timeout here to prevent stuck at previous screen
    setTimeout(() => {
      if (isLoadUser) {
        loadUser();
        onInitSuccess();
      } else {
        setupUser().then(() => {
          onInitSuccess();
        });
      }
    }, 100);
  }, [loadUser, setupUser, onInitSuccess, isLoadUser]);

  return (
    <CLayout>
      <Col style={styles.flex}>
        <Col.C style={styles.topContainer}>
          <Image source={images.logo} style={styles.logo} />
        </Col.C>
        <Col.T>
          <Text style={styles.title}>{`${
            isLoadUser ? 'Loading' : 'Creating'
          } your wallet...`}</Text>
        </Col.T>
        <Col.T mt={78}>
          <View style={styles.indicator}>
            <ActivityIndicator size={30} />
          </View>
        </Col.T>
      </Col>
    </CLayout>
  );
};

export default InitAccountScreen;

const styles = StyleSheet.create({
  topContainer: {
    width: '100%',
    height: '40%',
  },
  logo: {
    width: scale(124),
    height: scale(122),
  },
  title: {
    ...textStyles.Body1,
    color: colors.c232635,
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  flex: {
    flex: 1,
  },
});
