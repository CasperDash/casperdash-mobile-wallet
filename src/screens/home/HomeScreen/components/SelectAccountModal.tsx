import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { Text, StyleSheet, Platform, ScrollView, ActivityIndicator, View } from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'device';
import { colors, IconCircleClose, textStyles, IconPlusCircle, IconImportAccount } from 'assets';
import { CButton, Col, Row } from 'components';
import AccountItem from 'screens/home/HomeScreen/components/AccountItem';
import MainRouter from 'navigation/stack/MainRouter';
import { getListWallets, getPublicKey, getUser } from 'utils/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { WalletDescriptor, User } from 'react-native-casper-storage';
import { allActions } from 'redux_manager';
import {
  getWalletInfoWithPublicKey,
  cachePublicKey,
  serializeAndStoreUser,
  setSelectedWallet,
} from 'utils/helpers/account';
import ViewPrivateKeyButton from './ViewPrivateKeyButton';
import { IAccountInfo, useLedgerAccounts, useListAccountInfo } from 'utils/hooks/useAccountInfo';
import ViewAccountOnExplorer from './ViewAccountOnExplorer';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { useStackNavigation } from 'utils/hooks/useNavigation';

interface SelectAccountModalProps {
  connectionType: CONNECTION_TYPES;
}

const SelectAccountModal = forwardRef(({ connectionType }: SelectAccountModalProps, ref) => {
  const publicKey = useSelector(getPublicKey);
  const [isVisible, setVisible] = useState<boolean>(false);
  const [isCreatingNewAccount, setIsCreatingNewAccount] = useState<boolean>(false);

  const { navigate } = useStackNavigation();
  const listWallets = useSelector(getListWallets);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const selectedWallet = useSelector<any, IAccountInfo>((state: any) => state.user.selectedWallet);
  const currentAccount = useSelector<any, User>((state: any) => state.user.currentAccount);
  // This for the https://github.com/CasperDash/casperdash-mobile-wallet/issues/181
  // If close modal if focusing on a field, the app will stop responding
  const [editingAccountUid, setEditingAccountUid] = useState('');

  const [listWalletsDetails, setListWalletsDetails] = useState<IAccountInfo[]>(listWallets);

  const isLedgerMode = connectionType === CONNECTION_TYPES.ledger;
  const isPassPhaseMode = connectionType === CONNECTION_TYPES.passPhase;

  const { massagedData, isLoading } = useListAccountInfo(
    listWalletsDetails.filter((item) => item.publicKey).map((item) => item.publicKey!),
    { enabled: isVisible, staleTime: 1000 * 60 },
  );

  const walletsWithBalance = useMemo<IAccountInfo[]>(() => {
    return listWalletsDetails.map((wallet) => {
      const found = massagedData.find((item: { publicKey: string }) => item.publicKey === wallet.publicKey);
      return {
        ...wallet,
        ...found!,
      };
    });
  }, [massagedData, listWalletsDetails]);

  const {
    mergedData: ledgerAccounts,
    isLoading: isLoadingLedger,
    fetchNextPage,
  } = useLedgerAccounts(
    { startIndex: 0, numberOfKeys: 5 },
    {
      enabled: isVisible && isLedgerMode,
      onError: () => {
        hide();
      },
      retry: false,
    },
  );

  // load wallet public key if pass phrase connection type
  useEffect(() => {
    if (isVisible && isPassPhaseMode) {
      getWalletInfoWithPublicKey(user, listWallets).then((walletInfoWithPublicKey) => {
        setListWalletsDetails(walletInfoWithPublicKey);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listWallets), user, isVisible]);

  useImperativeHandle(ref, () => ({
    show: show,
  }));

  const show = () => {
    setVisible(true);
  };

  const hide = () => {
    setEditingAccountUid('');
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
      (isLedgerMode ? fetchNextPage() : createAccount()).finally(() => {
        setIsCreatingNewAccount(false);
      });
    }
  }, [createAccount, isCreatingNewAccount, isLedgerMode, fetchNextPage]);

  const handleOnCreateAccount = async () => {
    setIsCreatingNewAccount(true);
  };

  const reloadWallets = () => {
    dispatch(allActions.user.loadSelectedWalletFromStorage());
    dispatch(allActions.main.loadLocalStorage());
  };

  const onSelectWallet = async (walletInfoDetails: IAccountInfo) => {
    await setSelectedWallet(walletInfoDetails);
    reloadWallets();
    hide();
  };

  const onUpdateWalletName = async (walletInfoDetails: IAccountInfo, newName: string, isCurrentWallet: boolean) => {
    currentAccount.setWalletInfo(walletInfoDetails.walletInfo.uid, newName);
    if (isCurrentWallet) {
      const newInfo = currentAccount.getWalletInfo(walletInfoDetails.walletInfo.uid);
      await setSelectedWallet({ walletInfo: newInfo, publicKey: walletInfoDetails.publicKey!! });
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
          {isLoadingLedger && <ActivityIndicator />}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: scale(220) }}
            contentContainerStyle={{ paddingVertical: scale(10) }}
          >
            {walletsWithBalance?.concat(ledgerAccounts).map((walletDetails: IAccountInfo) => {
              return (
                <AccountItem
                  isCurrentAccount={selectedWallet?.walletInfo.uid === walletDetails.walletInfo?.uid}
                  data={walletDetails}
                  key={walletDetails.walletInfo?.uid}
                  onSelectWallet={onSelectWallet}
                  isLoadingBalance={isLoading}
                  isEditing={editingAccountUid === walletDetails.walletInfo?.uid}
                  setEditingAccountUid={setEditingAccountUid}
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
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>
              {isLedgerMode ? 'Load More Account' : 'Create New Account'}
            </Text>
          </Row>
        </CButton>
        {isPassPhaseMode && (
          <>
            <CButton onPress={openImportAccount}>
              <Row style={styles.rowItem}>
                <IconImportAccount width={scale(17)} height={scale(17)} />
                <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>Import Account</Text>
              </Row>
            </CButton>
            <ViewPrivateKeyButton onConfirm={hide} />
          </>
        )}
        <ViewAccountOnExplorer publicKey={publicKey} onPress={hide} />
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
