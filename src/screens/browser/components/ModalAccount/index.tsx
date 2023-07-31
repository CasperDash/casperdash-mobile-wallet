// Create sample react native template component
import React, { useContext } from 'react';
import { scale } from 'device';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { View, StyleSheet, Text, Platform, ActivityIndicator, ScrollView } from 'react-native';

import { IconCircleClose, colors, textStyles } from 'assets';
import { getwebUrl } from 'utils/selectors';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { CButton } from 'components';
import { AccountInfo, useMyAccounts } from 'utils/hooks/useAccountInfo';
import AccountItem from './AccountItem';
import CTextButton from 'components/CTextButton';
import { useConnectedSite } from 'screens/browser/hooks/useConnectedSite';
import { useUpdateAccountConnectedSite } from 'screens/browser/hooks/useUpdateAccountConnectedSite';
import { useDisconnectWithAccount } from 'screens/browser/hooks/useDisconnectWithAccount';
import { useDisconnectAllAccounts } from 'screens/browser/hooks/useDisconnectAllAccounts';
import { useConnectWithAccount } from 'screens/browser/hooks/useConnectWithAccount';
import { getUrlWithProtocol } from 'screens/browser/utils/url';
import BrowserContext from 'screens/browser/context';

type Props = {
  isVisible: boolean;
  onClose?: () => void;
};

const ModalAccount = ({ isVisible, onClose }: Props) => {
  const webUrl = useSelector(getwebUrl);
  const browserRef = useContext(BrowserContext);
  const { data: accounts, isLoading } = useMyAccounts({
    enabled: isVisible,
    onError: (err) => {
      console.log('err: ', err);
    },
  });

  const { disconnectWithAccount } = useDisconnectWithAccount({
    onDisconnectSite: () => {
      browserRef.current?.reload();
      onClose?.();
    },
  });
  const { connectedSite, urlWithProtocol } = useConnectedSite();
  const { updateAccountConnectedSite } = useUpdateAccountConnectedSite();
  const { disconnectAllAccounts } = useDisconnectAllAccounts();
  const { connectWithAccount } = useConnectWithAccount();
  const selectedAccountUid = connectedSite?.account?.uid;

  const listAccounts = accounts?.map((account) => {
    const logo = getBase64IdentIcon(account.publicKey);

    return {
      logo: {
        uri: logo,
      },
      account,
      description: `${account?.publicKey?.slice(0, 4)}...${account?.publicKey?.slice(-8)}`,
      walletInfo: account.walletInfo,
    };
  });

  const handleOnSelectAccount = (isConnected: boolean, account: AccountInfo) => {
    if (!isConnected) {
      return;
    }
    updateAccountConnectedSite(urlWithProtocol, {
      publicKey: account.publicKey!,
      uid: account.walletInfo?.uid!,
      walletInfo: account.walletInfo,
    });

    onClose?.();
  };

  const handleDisconnectAllAccounts = () => {
    disconnectAllAccounts(urlWithProtocol);
    onClose?.();
  };

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={() => onClose?.()}
      backdropColor={'rgba(252, 252, 253, 1)'}
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <View style={styles.container}>
        <View style={styles.cancel}>
          <CButton onPress={onClose}>
            <IconCircleClose width={scale(24)} height={scale(24)} />
          </CButton>
        </View>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Connected Account</Text>
          </View>
          <View style={styles.urlWrapper}>
            <Text>{getUrlWithProtocol(webUrl)}</Text>
          </View>
        </View>
        <ScrollView style={styles.body}>
          {isLoading ? (
            <View>
              <ActivityIndicator />
            </View>
          ) : (
            listAccounts?.map((item, index) => {
              const uid = item.account.walletInfo?.uid!;
              const isConnected = connectedSite?.connectedUids?.includes(uid);
              return (
                <AccountItem
                  style={styles.accountItem}
                  key={index}
                  logo={item.logo}
                  account={item.account}
                  description={item.description}
                  onTouch={() => handleOnSelectAccount(isConnected, item.account)}
                  onPress={
                    isConnected
                      ? () => disconnectWithAccount(urlWithProtocol, uid)
                      : () => connectWithAccount(urlWithProtocol, item.account.walletInfo)
                  }
                  buttonText={isConnected ? 'Disconnect' : 'Connect'}
                  titleStyle={!isConnected ? styles.titleAccount : undefined}
                  selectedUid={selectedAccountUid}
                />
              );
            })
          )}
        </ScrollView>
        <View>
          <CTextButton
            textStyle={styles.buttonTextStyle}
            type="line"
            text={'Disconnect all accounts'}
            style={[styles.buttonOutline]}
            onPress={handleDisconnectAllAccounts}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: scale(223),
    backgroundColor: colors.W1,
    borderRadius: scale(16),
    padding: scale(18),

    shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: scale(16),
    shadowOpacity: 0.6,

    elevation: 10,
  },
  cancel: {
    alignItems: 'flex-end',
  },
  header: {
    marginTop: scale(20),
  },
  body: {
    marginTop: scale(30),
    gap: scale(20),
    maxHeight: scale(200),
  },
  urlWrapper: {
    marginTop: scale(20),
    padding: scale(12),
    borderRadius: scale(16),
    borderWidth: scale(1),
    borderColor: colors.cE0E0E0,
    alignItems: 'center',
  },
  accountItem: {
    padding: scale(12),
  },
  title: {
    ...textStyles.Body1,
    color: colors.c000000,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  titleAccount: {
    color: colors.c828489,
  },
  buttonTextStyle: {},
  buttonOutline: {
    marginTop: scale(20),
    width: 'auto',
    borderWidth: scale(0),
  },
});

export default ModalAccount;
