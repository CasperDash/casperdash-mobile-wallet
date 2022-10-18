import React, { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { CLayout, CHeader } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { Row, Col } from 'components';
import CTextButton from 'components/CTextButton';
import { useSelector } from 'react-redux';
import { getUser, getSelectedWallet } from 'utils/selectors/user';
import { User } from 'react-native-casper-storage';
import { WalletInfoDetails, getWalletDetails } from 'utils/helpers/account';

import { useCopyToClipboard } from 'utils/hooks/useCopyClipboard';

const PrivateKeyScreen = () => {
  const copyToClipboard = useCopyToClipboard();

  const user = useSelector<any, User>(getUser);
  const selectedWallet = useSelector<any, WalletInfoDetails>(getSelectedWallet);

  const [privateKey, setPrivateKey] = useState<string>();

  useEffect(() => {
    getWalletDetails(user, selectedWallet).then(details => {
      setPrivateKey(details?.getPrivateKeyInPEM());
    });
  }, [user, selectedWallet]);

  return (
    <CLayout
      bgColor={colors.cF8F8F8}
      edges={['top', 'left', 'right']}
      statusBgColor={colors.cF8F8F8}>
      <CHeader
        title={'Private Key'}
        style={{ backgroundColor: colors.cF8F8F8 }}
      />
      <Col mt={10} py={24} style={styles.container}>
        <Text style={[styles.noteText]}>
          {selectedWallet.walletInfo.descriptor.name}
        </Text>
        <Row.C style={styles.secretKeyContainer} mx={20} py={10}>
          <Text>{privateKey}</Text>
        </Row.C>
        <Row.B style={styles.copyBtnContainer}>
          <CTextButton
            type={'line'}
            text={'Copy'}
            onPress={async () => {
              copyToClipboard(privateKey || '');
            }}
          />
        </Row.B>
      </Col>
    </CLayout>
  );
};

export default PrivateKeyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  body: {
    width: scale(343),
    borderRadius: scale(16),
    borderWidth: scale(1),
    borderColor: colors.gray6,
  },
  contentContainerStyle: {
    alignItems: 'center',
    paddingVertical: scale(25),
  },
  noteText: {
    ...textStyles.Body1,
    marginBottom: scale(8),
    marginHorizontal: scale(24),
  },
  title: {
    ...textStyles.Body1,
    color: colors.N3,
    marginBottom: scale(8),
    marginHorizontal: scale(24),
  },
  secretKeyContainer: {
    borderColor: colors.N3,
    borderWidth: 0.5,
    borderRadius: scale(8),
  },
  copyBtnContainer: {
    marginTop: scale(100),
  },
});
