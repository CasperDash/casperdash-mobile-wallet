import React, { useCallback, useEffect } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, Image } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import { CLayout, Col } from 'components';
import { colors, fonts, textStyles, images } from 'assets';
import { scale } from 'device';
// @ts-ignore
import { CommonActions } from '@react-navigation/native';
import { Config, Keys } from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { IHDKey, IWallet, WalletDescriptor } from 'react-native-casper-storage';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import {
  createNewUserWithHdWallet,
  getUserFromStorage,
  serializeAndStoreUser,
  setSelectedWallet,
} from 'utils/helpers/account';
import { getSelectedWallet, getUser } from 'utils/selectors/user';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import { IAccountInfo, getLedgerAccountInfo } from 'utils/hooks/useAccountInfo';

const InitAccountScreen: React.FC<
  // @ts-ignore
  ScreenProps<CreateNewWalletRouter.INIT_ACCOUNT_SCREEN>
> = ({ route }) => {
  const { phrases, algorithm, isLoadUser, derivationPath } = route.params;

  const navigation = useStackNavigation();
  const dispatch = useDispatch();
  const currentUser = useSelector(getUser);
  const selectedWalletInfo = useSelector(getSelectedWallet);

  // this is for new user flow
  const setupUser = useCallback(async () => {
    if (!phrases || !algorithm || currentUser) {
      return;
    }

    try {
      const masterPassword = await Config.getItem(Keys.masterPassword);
      const user = await createNewUserWithHdWallet(masterPassword, phrases, algorithm, derivationPath);
      const acc0: IWallet<IHDKey> = await user.getWalletAccount(0);
      user.setWalletInfo(acc0.getReferenceKey(), new WalletDescriptor('Account 1'));
      const publicKey = await acc0.getPublicKey();
      const info = {
        publicKey: publicKey,
        loginOptions: {
          connectionType: CONNECTION_TYPES.passPhase,
        },
      };
      await serializeAndStoreUser(user, info);

      const wallets = user.getHDWallet()?.derivedWallets || [];
      const selectedWallet = wallets[0];
      await setSelectedWallet({ walletInfo: selectedWallet, publicKey });

      dispatch(allActions.user.getUserSuccess(user));
    } catch (e: any) {
      const message = {
        message: e?.message ? e.message : 'Error on create new user',
        type: MessageType.error,
      };
      dispatch(allActions.main.showMessage(message, 10000));
      throw e;
    }
  }, [algorithm, dispatch, phrases, currentUser, derivationPath]);

  // this is for existing user flow
  const loadUser = useCallback(async () => {
    if (!currentUser) {
      try {
        const masterPassword = await Config.getItem(Keys.masterPassword);
        const loadedUser = await getUserFromStorage(masterPassword);
        if (loadedUser) {
          let selectedWallet = await Config.getItem(Keys.selectedWallet);
          // if no uid should set default wallet to first hd wallet
          if (!selectedWallet?.walletInfo?.uid) {
            const defaultWallet = loadedUser.getHDWallet().derivedWallets?.[0];
            const wallet = await loadedUser.getWalletAccount(defaultWallet.index);
            const publicKey = await wallet.getPublicKey();
            await setSelectedWallet({ walletInfo: defaultWallet, publicKey });
          }
          dispatch(allActions.user.getUserSuccess(loadedUser));
        }
      } catch (e: any) {
        const message = {
          message: e?.message ? e.message : 'Error on load user',
          type: MessageType.error,
        };
        dispatch(allActions.main.showMessage(message, 10000));
        throw e;
      }
    }
  }, [dispatch, currentUser]);

  // after load user or setup user success
  const onInitSuccess = useCallback(
    (isLedger?: boolean) => {
      if (currentUser || isLedger) {
        dispatch(allActions.main.initState());
      }
    },
    [dispatch, currentUser],
  );

  // migrate old ledger wallet
  const migrateLedgerWallet = useCallback(async (info: any) => {
    let selectedWallet = await Config.getItem(Keys.selectedWallet);
    if (!selectedWallet) {
      if (info?.loginOptions?.keyIndex !== undefined) {
        selectedWallet = getLedgerAccountInfo(info?.loginOptions?.keyIndex, info.publicKey);

        await setSelectedWallet(selectedWallet);
      }
    }
    let ledgerWallets = (await Config.getItem(Keys.ledgerWallets)) || [];
    if (!ledgerWallets?.length) {
      const device = await Config.getItem(Keys.ledger);
      ledgerWallets = [{ ...selectedWallet, ledgerDeviceId: device?.id }];
      await Config.saveItem<IAccountInfo[]>(Keys.ledgerWallets, ledgerWallets);
    }
  }, []);

  useEffect(() => {
    Config.getItem(Keys.casperdash).then(async (info: any) => {
      // ledger or view mode no need to load user
      if (
        info?.loginOptions?.connectionType === CONNECTION_TYPES.ledger ||
        info?.loginOptions?.connectionType === CONNECTION_TYPES.viewMode
      ) {
        // migrate old ledger wallet
        if (info?.loginOptions?.connectionType === CONNECTION_TYPES.ledger) {
          await migrateLedgerWallet(info);
        }
        // if already have user
      } else if (isLoadUser) {
        await loadUser();

        // if no user
      } else {
        await setupUser();
      }
      onInitSuccess(info?.loginOptions?.connectionType === CONNECTION_TYPES.ledger);
    });
  }, [loadUser, setupUser, onInitSuccess, isLoadUser, migrateLedgerWallet]);

  // check selected wallet before go to main screen
  useEffect(() => {
    if (selectedWalletInfo?.walletInfo?.uid) {
      navigation.dispatch(
        CommonActions.reset({
          routes: [
            {
              name: 'MainStack',
            },
          ],
        }),
      );
      const message = {
        message: 'Logged in successfully',
        type: MessageType.success,
      };
      dispatch(allActions.main.showMessage(message, 1000));
    }
  }, [selectedWalletInfo, dispatch, navigation]);

  return (
    <CLayout>
      <Col style={styles.flex}>
        <Col.C style={styles.topContainer}>
          <Image source={images.logo} style={styles.logo} />
        </Col.C>
        <Col.T>
          <Text style={styles.title}>{`${isLoadUser ? 'Loading' : 'Creating'} your wallet...`}</Text>
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
