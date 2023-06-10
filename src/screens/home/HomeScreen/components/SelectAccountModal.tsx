import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Text, StyleSheet, Platform, ScrollView, ActivityIndicator, View } from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'device';
import { colors, IconCircleClose, textStyles, IconPlusCircle, IconImportAccount } from 'assets';
import { CButton, Col, Row } from 'components';
import AccountItem from 'screens/home/HomeScreen/components/AccountItem';
import { useNavigation } from '@react-navigation/native';
import MainRouter from 'navigation/stack/MainRouter';
import { getListWallets, getUser } from 'utils/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { WalletDescriptor, User } from 'react-native-casper-storage';
import { allActions } from 'redux_manager';
import {
  getWalletInfoWithPublicKey,
  WalletInfoDetails,
  cachePublicKey,
  serializeAndStoreUser,
  setSelectedWallet,
} from 'utils/helpers/account';
import ViewPrivateKeyButton from './ViewPrivateKeyButton';
import { IAccountInfo, useListAccountInfo } from 'utils/hooks/useAccountInfo';

const SelectAccountModal = forwardRef((props: any, ref) => {
  const [isVisible, setVisible] = useState<boolean>(false);
  const [isCreatingNewAccount, setIsCreatingNewAccount] = useState<boolean>(false);

  const { navigate } = useNavigation();
  const listWallets = useSelector(getListWallets);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const selectedWallet = useSelector<any, WalletInfoDetails>((state: any) => state.user.selectedWallet);
  const currentAccount = useSelector<any, User>((state: any) => state.user.currentAccount);

  const [listWalletsDetails, setListWalletsDetails] = useState<WalletInfoDetails[]>(listWallets);

  const { massagedData, isLoading } = useListAccountInfo(
    listWalletsDetails.filter((item) => item.publicKey).map((item) => item.publicKey!),
    { enabled: isVisible, staleTime: 100 },
  );

  const walletsWithBalance = useMemo<(WalletInfoDetails & IAccountInfo)[]>(() => {
    return listWalletsDetails.map((wallet) => {
      const found = massagedData.find((item: { publicKey: string }) => item.publicKey === wallet.publicKey);
      return {
        ...wallet,
        ...found!,
      };
    });
  }, [massagedData, listWalletsDetails]);

  useEffect(() => {
    if (isVisible) {
      getWalletInfoWithPublicKey(user, listWallets).then((walletInfoWithPublicKey) => {
        setListWalletsDetails(walletInfoWithPublicKey);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listWallets), dispatch, user, isVisible]);

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

  const createAccount = useCallback(async () => {
    const wallets = currentAccount.getHDWallet()?.derivedWallets || [];
    const newWallet = await currentAccount.addWalletAccount(
      wallets.length,
      new WalletDescriptor(`Account ${wallets.length + 1}`),
    );

    const walletInfo = currentAccount.getWalletInfo(newWallet.getReferenceKey());

    await cachePublicKey(walletInfo.uid, await newWallet.getPublicKey());

    await serializeAndStoreUser(currentAccount);

    dispatch(allActions.user.getUserSuccess(currentAccount));
    dispatch(allActions.main.loadLocalStorage());
    setIsCreatingNewAccount(false);
  }, [currentAccount, dispatch]);

  useEffect(() => {
    if (isCreatingNewAccount) {
      createAccount();
    }
  }, [createAccount, isCreatingNewAccount]);

  const handleOnCreateAccount = async () => {
    setIsCreatingNewAccount(true);
  };

  const reloadWallets = () => {
    dispatch(allActions.user.loadSelectedWalletFromStorage());
    dispatch(allActions.main.loadLocalStorage());
  };

  const onSelectWallet = async (walletInfoDetails: WalletInfoDetails) => {
    await setSelectedWallet(walletInfoDetails.walletInfo, walletInfoDetails.publicKey!!);
    reloadWallets();
    hide();
  };

  const onUpdateWalletName = async (
    walletInfoDetails: WalletInfoDetails,
    newName: string,
    isCurrentWallet: boolean,
  ) => {
    currentAccount.setWalletInfo(walletInfoDetails.walletInfo.uid, newName);
    if (isCurrentWallet) {
      const newInfo = currentAccount.getWalletInfo(walletInfoDetails.walletInfo.uid);
      await setSelectedWallet(newInfo, walletInfoDetails.publicKey!!);
    }
    await serializeAndStoreUser(currentAccount);
    reloadWallets();
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
      animationOut={'fadeOut'}
    >
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
            contentContainerStyle={{ paddingVertical: scale(10) }}
          >
            {walletsWithBalance &&
              walletsWithBalance.length > 0 &&
              walletsWithBalance.map((walletDetails: WalletInfoDetails & IAccountInfo) => {
                return (
                  <AccountItem
                    isCurrentAccount={selectedWallet?.walletInfo.uid === walletDetails.walletInfo.uid}
                    data={walletDetails}
                    key={walletDetails.walletInfo.uid}
                    onSelectWallet={onSelectWallet}
                    isLoadingBalance={isLoading}
                    onUpdateWalletName={onUpdateWalletName}
                  />
                );
              })}
          </ScrollView>
        </Col>
        <CButton onPress={handleOnCreateAccount} disabled={isCreatingNewAccount}>
          <Row style={styles.rowItem}>
            {!isCreatingNewAccount ? (
              <IconPlusCircle width={scale(17)} height={scale(17)} />
            ) : (
              <View>
                <ActivityIndicator size="small" color={colors.N2} />
              </View>
            )}
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>Create New Account</Text>
          </Row>
        </CButton>
        <CButton onPress={openImportAccount}>
          <Row style={styles.rowItem}>
            <IconImportAccount width={scale(17)} height={scale(17)} />
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>Import Account</Text>
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
    shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
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
