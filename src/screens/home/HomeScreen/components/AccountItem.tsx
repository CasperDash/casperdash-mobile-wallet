import React from 'react';
import { Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';
import { WalletInfoDetails } from 'utils/helpers/account';
import { toFormattedNumber } from 'utils/helpers/format';

interface IAccountItemProps {
  data: WalletInfoDetails;
  isCurrentAccount?: boolean;
  onSelectWallet: (data: WalletInfoDetails) => void;
  isLoadingBalance?: boolean;
}

const AccountItem = ({
  data,
  isCurrentAccount,
  onSelectWallet,
  isLoadingBalance,
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
            {isLoadingBalance && (
              <View style={{ marginRight: scale(8) }}>
                <ActivityIndicator size="small" color={colors.N2} />
              </View>
            )}
            {toFormattedNumber(data.balance) || 0} CSPR
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
