import { colors, textStyles } from 'assets';
import { CButton } from 'components';
import { scale } from 'device';
import URL from 'url-parse';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { getwebUrl } from 'utils/selectors';
import ListAccounts from './ListAccounts';
import { getUrlWithProtocol, prefixUrlWithProtocol } from 'screens/browser/utils/url';
import { useConnectWithAccount } from 'screens/browser/hooks/useConnectWithAccount';
import { AccountInfo } from 'utils/hooks/useAccountInfo';

type Props = {
  onClose?: () => void;
  url?: string;
};
const ConnectContent = ({ onClose, url }: Props) => {
  const { connectWithAccount } = useConnectWithAccount();
  const webUrl = useSelector(getwebUrl);
  const [selectedAccount, setSelectedAccount] = useState<AccountInfo>(null!);

  const handleOnPress = () => {
    if (!url) {
      return;
    }

    const parsedUrl = new URL(url);
    const urlWithProtocol = prefixUrlWithProtocol(parsedUrl.hostname);

    connectWithAccount(urlWithProtocol, selectedAccount.walletInfo);

    onClose?.();
  };

  const handleOnSelectAccount = (account: AccountInfo) => {
    setSelectedAccount(account);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={textStyles.H5}>Connect to browser</Text>
        <Text style={textStyles.Cap2}>This site is requesting access to your wallet</Text>
        <View>
          <Text style={[textStyles.Sub2, styles.urlText]}>{getUrlWithProtocol(webUrl)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <ListAccounts
          style={styles.listAccounts}
          onSelectAccount={handleOnSelectAccount}
          selectedUid={selectedAccount?.walletInfo?.uid}
        />
      </View>
      <View style={styles.footer}>
        <CButton onPress={handleOnPress} style={[styles.button, styles.buttonPrimary]} disabled={!selectedAccount}>
          <Text>Connect</Text>
        </CButton>
        <CButton onPress={onClose} style={[styles.button, styles.buttonOutline]}>
          <Text>Cancel</Text>
        </CButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    gap: scale(20),
    justifyContent: 'space-between',
    paddingVertical: scale(40),
  },
  header: {
    marginTop: scale(20),
    alignItems: 'center',
  },
  listAccounts: {
    marginTop: scale(20),
  },
  body: {
    padding: scale(20),
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  urlText: {
    marginTop: scale(20),
    textAlign: 'center',
  },
  footer: {
    flexBasis: scale(40),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: scale(140),
    height: scale(40),
    borderRadius: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.R1,
  },
  buttonOutline: {
    borderRadius: scale(90),
    borderWidth: scale(1),
    borderColor: colors.c000000,
  },
});

export default ConnectContent;
