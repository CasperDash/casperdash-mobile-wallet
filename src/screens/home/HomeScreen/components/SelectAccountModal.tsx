import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'device';
import {
  colors,
  IconCircleClose,
  textStyles,
  IconPlusCircle,
  IconImportAccount,
} from 'assets';
import { CButton, Col, Row } from 'components';
import AccountItem from 'screens/home/HomeScreen/components/AccountItem';
import { useNavigation } from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';
import { getListWallets, getUser } from 'utils/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { WalletDescriptor, User } from 'react-native-casper-storage';
import { Config, Keys } from 'utils';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import {
  getWalletInfoWithPublicKey,
  WalletInfoDetails,
} from 'utils/helpers/account';
import { convertBalanceFromHex } from 'utils/helpers/balance';
import ViewPrivateKeyButton from './ViewPrivateKeyButton';

const SelectAccountModal = forwardRef((props: any, ref) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isCreateNewAccount, setIsCreateNewAccount] = useState<boolean>(false);

  const { navigate } = useNavigation();
  const listWallets = useSelector(getListWallets);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const selectedWallet = useSelector<any, WalletInfoDetails>(
    (state: any) => state.user.selectedWallet,
  );
  const currentAccount = useSelector<any, User>(
    (state: any) => state.user.currentAccount,
  );

  const [listWalletsDetails, setListWalletsDetails] =
    useState<WalletInfoDetails[]>(listWallets);

  useEffect(() => {
    if (isVisible) {
      console.time('getwalletinfo');
      getWalletInfoWithPublicKey(user, listWallets).then(
        walletInfoWithPublicKey => {
          console.timeEnd('getwalletinfo');
          setListWalletsDetails(walletInfoWithPublicKey);

          setIsLoadingBalance(true);
          const publicKeys = walletInfoWithPublicKey
            .filter(info => info.publicKey)
            .map(info => ({
              publicKey: info.publicKey,
            }));
          dispatch(
            allActions.user.getAccounts(
              { publicKeys },
              async (_err: any, data: any) => {
                const walletsWithBalance = walletInfoWithPublicKey.map(
                  wallet => {
                    const found = data.find(
                      (item: { publicKey: string }) =>
                        item.publicKey === wallet.publicKey,
                    );
                    const balance =
                      found && found.balance
                        ? convertBalanceFromHex(found?.balance?.hex)
                        : 0;
                    return {
                      ...wallet,
                      balance,
                    };
                  },
                );
                setIsLoadingBalance(false);
                setListWalletsDetails(walletsWithBalance);
              },
            ),
          );
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listWallets), dispatch, user, isVisible]);

  const createNewAccount = useCallback(async () => {
    setIsCreateNewAccount(true);
    const wallets = currentAccount.getHDWallet()?.derivedWallets || [];

    await currentAccount.addWalletAccount(
      wallets.length,
      new WalletDescriptor(`Account ${wallets.length + 1}`),
    );

    const userInfo = await currentAccount.serialize();

    const casperDashInfo = await Config.getItem(Keys.casperdash);
    casperDashInfo.userInfo = userInfo.value;
    casperDashInfo.loginOptions.hashingOptions = userInfo.passwordOptions;
    await Config.saveItem(Keys.casperdash, casperDashInfo);
    dispatch(allActions.user.getUserSuccess(currentAccount));
    dispatch(allActions.main.loadLocalStorage());
    setIsCreateNewAccount(false);
  }, [currentAccount, dispatch]);

  useImperativeHandle(ref, () => ({
    show: show,
  }));

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  const openImportAccount = () => {
    hide();
    navigate(MainRouter.IMPORT_ACCOUNT_SCREEN);
  };

  const handleOnCreateAccount = () => {
    createNewAccount()
      .then(() => {
        const message = {
          message: 'Your account has been created successfully',
          type: MessageType.success,
        };
        dispatch(allActions.main.showMessage(message));
      })
      .catch(err => console.log(err));
  };

  const onSelectWallet = async (walletInfoDetails: WalletInfoDetails) => {
    const casperDashInfo = await Config.getItem(Keys.casperdash);
    casperDashInfo.publicKey = walletInfoDetails.publicKey;
    await Config.saveItem(Keys.casperdash, casperDashInfo);
    await Config.saveItem(Keys.selectedWallet, {
      ...walletInfoDetails,
      walletInfo: {
        descriptor: walletInfoDetails.walletInfo.descriptor,
        encryptionType: walletInfoDetails.walletInfo.encryptionType,
        uid: walletInfoDetails.walletInfo.uid,
      },
    });
    dispatch(allActions.user.loadSelectedWalletFromStorage());
    dispatch(allActions.main.loadLocalStorage());
    hide();
  };

  return (
    <Modal
      style={styles.container}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={hide}
      backdropColor={'rgba(252, 252, 253, 1)'}
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <Col style={styles.body}>
        <Row.R>
          <CButton onPress={hide}>
            <IconCircleClose width={scale(24)} height={scale(24)} />
          </CButton>
        </Row.R>
        <Col mb={12} style={styles.accountContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: scale(220) }}
            contentContainerStyle={{ paddingVertical: scale(10) }}>
            {listWalletsDetails &&
              listWalletsDetails.length > 0 &&
              listWalletsDetails.map(
                (walletDetails: WalletInfoDetails, index: number) => {
                  return (
                    <AccountItem
                      isCurrentAccount={
                        selectedWallet?.walletInfo.uid ===
                        walletDetails.walletInfo.uid
                      }
                      data={walletDetails}
                      key={index}
                      onSelectWallet={onSelectWallet}
                      isLoadingBalance={isLoadingBalance}
                    />
                  );
                },
              )}
          </ScrollView>
        </Col>
        <CButton onPress={handleOnCreateAccount} disabled={isCreateNewAccount}>
          <Row style={styles.rowItem}>
            {!isCreateNewAccount ? (
              <IconPlusCircle width={scale(17)} height={scale(17)} />
            ) : (
              <View>
                <ActivityIndicator size="small" color={colors.N2} />
              </View>
            )}
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>
              Create New Account
            </Text>
          </Row>
        </CButton>
        <CButton onPress={openImportAccount}>
          <Row style={styles.rowItem}>
            <IconImportAccount width={scale(17)} height={scale(17)} />
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>
              Import Account
            </Text>
          </Row>
        </CButton>
        <ViewPrivateKeyButton onConfirm={hide} />
      </Col>
    </Modal>
  );
});

export default SelectAccountModal;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: scale(320),
    minHeight: scale(223),
    backgroundColor: colors.W1,
    borderRadius: scale(16),
    padding: scale(24),
    paddingBottom: scale(14),
    shadowColor:
      Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: scale(16),
    shadowOpacity: 0.6,

    elevation: 10,
  },
  message: {
    ...textStyles.Body1,
    marginVertical: scale(32),
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
  },
  button: {
    width: scale(136),
    height: scale(48),
  },
  accountContainer: {
    borderBottomWidth: scale(1),
    borderBottomColor: colors.N5,
  },
  rowItem: {
    alignItems: 'center',
    minHeight: scale(40),
  },
});
