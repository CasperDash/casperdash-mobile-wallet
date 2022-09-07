import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';
import { WalletInfoDetails } from 'utils/helpers/account';

interface IAccountItemProps {
  data: WalletInfoDetails;
  isCurrentAccount?: boolean;
  onSelectWallet: (data: WalletInfoDetails) => void;
}

const AccountItem = ({
  data,
  isCurrentAccount,
  onSelectWallet,
}: IAccountItemProps) => {
  return (
    <CButton onPress={() => onSelectWallet(data)}>
      <Row.LR my={10} style={styles.container}>
        <Text style={[styles.sub, isCurrentAccount && { color: colors.B1 }]}>
          {data && data.walletInfo.descriptor && data.walletInfo.descriptor.name
            ? data.walletInfo.descriptor.name
            : ''}
        </Text>
        <Col style={styles.rightContent}>
          <Text style={[styles.body, isCurrentAccount && { color: colors.B1 }]}>
            {data.balance || 0} CSPR
          </Text>
        </Col>
      </Row.LR>
    </CButton>
  );
};

export default AccountItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'flex-start',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: scale(14),
  },
  body: {
    ...textStyles.Body1,
  },
  sub: {
    ...textStyles.Sub1,
    textAlign: 'right',
  },
});
