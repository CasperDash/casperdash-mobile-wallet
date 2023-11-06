import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { scale } from 'device';
import { colors, IconConnectLedger, textStyles, IconPlusCircle, IconImportAccount } from 'assets';
import { CHeader, CLayout, Col } from 'components';
import AccountItem from 'screens/home/AccountListScreen/AccountItem';
import MainRouter from 'navigation/stack/MainRouter';
import { getListWallets, getPublicKey, getUser, getLoginOptions } from 'utils/selectors/user';
import { useDispatch, useSelector } from 'react-redux';
import { WalletDescriptor, User } from 'react-native-casper-storage';
import { allActions } from 'redux_manager';
import {
  getWalletInfoWithPublicKey,
  cachePublicKey,
  serializeAndStoreUser,
  setSelectedWallet,
} from 'utils/helpers/account';
import { IAccountInfo, useGetConnectedLedgerWallets, useListAccountInfo } from 'utils/hooks/useAccountInfo';
import ViewAccountOnExplorer from './ViewAccountOnExplorer';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import _uniqBy from 'lodash/uniqBy';
import CTextButton from 'components/CTextButton';
import { EditAccountNameModal } from './EditAccountNameModal';
import { Config, Keys } from 'utils';

const AccountListScreen = () => {
  const loginOptions = useSelector(getLoginOptions);
  const connectionType = loginOptions?.connectionType;
  const publicKey = useSelector(getPublicKey);
  const [isCreatingNewAccount, setIsCreatingNewAccount] = useState<boolean>(false);

  const { replace, navigate } = useStackNavigation();
  const listWallets = useSelector(getListWallets);
  const user = useSelector(getUser);
  const dispatch = useDispatch();
  const selectedWallet = useSelector<any, IAccountInfo>((state: any) => state.user.selectedWallet);
  const currentAccount = useSelector<any, User>((state: any) => state.user.currentAccount);
  const [editingAccount, setEditingAccount] = useState<IAccountInfo | undefined>();

  const [listWalletsDetails, setListWalletsDetails] = useState<IAccountInfo[]>(listWallets);

  const isPassPhaseMode = connectionType === CONNECTION_TYPES.passPhase;

  const {
    data: ledgerWallets,
    isFetched: isFetchedLedgerWallets,
    refetch: refetchLedgerWallets,
  } = useGetConnectedLedgerWallets({ staleTime: 0 });

  const { massagedData, isLoading } = useListAccountInfo(
    listWalletsDetails.filter((item) => item.publicKey).map((item) => item.publicKey!),
    { staleTime: 1000 * 60 },
  );

  const walletsWithBalance = useMemo<IAccountInfo[]>(() => {
    if (!isFetchedLedgerWallets) return [];
    return listWalletsDetails.concat(ledgerWallets || []).map((wallet) => {
      const found = massagedData.find((item: { publicKey: string }) => item.publicKey === wallet.publicKey);
      return {
        ...wallet,
        ...found,
      };
    });
  }, [massagedData, listWalletsDetails, ledgerWallets, isFetchedLedgerWallets]);

  // load wallet public key if pass phrase connection type
  useEffect(() => {
    if (isPassPhaseMode) {
      getWalletInfoWithPublicKey(user, listWallets).then((walletInfoWithPublicKey) => {
        setListWalletsDetails(walletInfoWithPublicKey);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(listWallets), user]);

  const openImportAccount = () => {
    navigate(MainRouter.IMPORT_ACCOUNT_SCREEN);
  };

  const createAccount = useCallback(async () => {
    const wallets = currentAccount.getHDWallet()?.derivedWallets || [];
    const sortedWallets = wallets.sort((a, b) => a.index - b.index);
    let nextIndex = 0;
    for (let i = 0; i < sortedWallets.length; i++) {
      if (sortedWallets[i].index !== i) {
        nextIndex = i;
        break;
      }
      nextIndex = i + 1;
    }

    const newWallet = await currentAccount.addWalletAccount(
      nextIndex,
      new WalletDescriptor(`Account ${nextIndex + 1}`),
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
      createAccount().finally(() => {
        setIsCreatingNewAccount(false);
      });
    }
  }, [createAccount, isCreatingNewAccount]);

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
  };

  const onUpdateWalletName = async (newName: string) => {
    if (!editingAccount) return;
    currentAccount.setWalletInfo(editingAccount.walletInfo.uid, newName);
    if (selectedWallet?.walletInfo.uid === editingAccount.walletInfo.uid) {
      const newInfo = currentAccount.getWalletInfo(editingAccount.walletInfo.uid);
      await setSelectedWallet({ walletInfo: newInfo, publicKey: editingAccount.publicKey!! });
    }
    await serializeAndStoreUser(currentAccount);
    reloadWallets();
  };

  const allAccount = useMemo(() => {
    return _uniqBy((walletsWithBalance || []).concat(selectedWallet), 'walletInfo.uid').filter(Boolean);
  }, [walletsWithBalance, selectedWallet]);

  const onDeleteWallet = async (walletInfoDetails: IAccountInfo) => {
    if (walletInfoDetails.isLedger) {
      const newLedgerWallets = ledgerWallets?.filter((item) => item.publicKey !== walletInfoDetails.publicKey);
      await Config.saveItem(Keys.ledgerWallets, newLedgerWallets);
      await refetchLedgerWallets();
      return;
    }
    currentAccount.removeWalletInfo(walletInfoDetails.walletInfo.uid);
    await serializeAndStoreUser(currentAccount);
    reloadWallets();
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} statusBgColor={colors.cF8F8F8}>
      <CHeader
        title="Accounts"
        style={{ backgroundColor: colors.cF8F8F8 }}
        onBack={() => navigate(MainRouter.HOME_TAB)}
      />
      <Col style={styles.body}>
        <Col mb={8}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: scale(420) }}
            contentContainerStyle={{ paddingVertical: scale(10) }}
          >
            {allAccount.map((walletDetails: IAccountInfo) => {
              return (
                <AccountItem
                  isCurrentAccount={selectedWallet?.walletInfo.uid === walletDetails?.walletInfo?.uid}
                  data={walletDetails}
                  key={walletDetails.walletInfo?.uid}
                  onSelectWallet={onSelectWallet}
                  isLoadingBalance={isLoading}
                  setEditingAccount={setEditingAccount}
                  onDeleteWallet={onDeleteWallet}
                />
              );
            })}
          </ScrollView>
        </Col>
        <Col style={styles.actionContainer}>
          {isPassPhaseMode && (
            <CTextButton
              onPress={handleOnCreateAccount}
              disabled={isCreatingNewAccount}
              type="line"
              textStyle={{ color: colors.N2 }}
              icon={
                !isCreatingNewAccount ? (
                  <IconPlusCircle width={scale(17)} height={scale(17)} />
                ) : (
                  <ActivityIndicator size="small" color={colors.N2} />
                )
              }
              text={'Create New Account'}
              style={styles.actionButton}
            />
          )}
          <CTextButton
            type="line"
            textStyle={{ color: colors.N2 }}
            icon={<IconConnectLedger width={scale(17)} height={scale(17)} />}
            text="Add Hardware Wallet"
            style={styles.actionButton}
            onPress={() => replace(MainRouter.CONNECT_LEDGER_SCREEN)}
          />
          {isPassPhaseMode && (
            <CTextButton
              type="line"
              textStyle={{ color: colors.N2 }}
              onPress={openImportAccount}
              icon={<IconImportAccount width={scale(17)} height={scale(17)} />}
              text="Import Private Key"
              style={styles.actionButton}
            />
          )}
          <ViewAccountOnExplorer publicKey={publicKey} />
        </Col>
      </Col>

      <EditAccountNameModal
        onChangeName={onUpdateWalletName}
        setEditingAccount={setEditingAccount}
        account={editingAccount}
      />
    </CLayout>
  );
};

export default AccountListScreen;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    minHeight: scale(223),
    backgroundColor: colors.W1,
    borderRadius: scale(24),
    padding: scale(24),
    justifyContent: 'space-between',
    flex: 1,
    borderTopWidth: scale(1),
    borderTopColor: colors.N5,
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
  actionContainer: {
    paddingTop: scale(16),
    borderTopWidth: scale(1),
    borderTopColor: colors.N5,
  },
  rowItem: {
    alignItems: 'center',
    minHeight: scale(40),
  },
  actionButton: {
    marginBottom: scale(8),
    borderColor: colors.N4,
  },
});
