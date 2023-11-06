import React from 'react';
import { Text, StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { Row, Col, CButton } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconPencilFilled, IconTrash } from 'assets';
import { toFormattedNumber } from 'utils/helpers/format';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';

interface IAccountItemProps {
  data: IAccountInfo;
  isCurrentAccount: boolean;
  onSelectWallet: (data: IAccountInfo) => void;
  isLoadingBalance?: boolean;
  setEditingAccount: React.Dispatch<React.SetStateAction<IAccountInfo | undefined>>;
  onDeleteWallet: (walletInfoDetails: IAccountInfo) => void;
}

const AccountItem = ({
  data,
  isCurrentAccount,
  onSelectWallet,
  isLoadingBalance,
  setEditingAccount,
  onDeleteWallet,
}: IAccountItemProps) => {
  return (
    <Row.LR my={10} style={styles.container}>
      <Col style={styles.leftContent}>
        {!data.isLedger ? (
          <TouchableOpacity onPress={() => setEditingAccount(data)} style={{ paddingVertical: scale(10) }}>
            <IconPencilFilled width={scale(16)} height={scale(16)} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: scale(16), height: scale(16) }} />
        )}
        <CButton onPress={() => onSelectWallet(data)} style={{ marginLeft: scale(16) }}>
          <Text style={[styles.sub, isCurrentAccount && { color: colors.B1 }]}>
            {data?.walletInfo?.descriptor?.name || ''}
          </Text>
          <Text
            numberOfLines={1}
            ellipsizeMode={'middle'}
            style={[styles.sub, isCurrentAccount && { color: colors.B1 }]}
          >
            {data?.publicKey}
          </Text>
        </CButton>
      </Col>
      <Col style={styles.rightContent}>
        <Text style={[styles.body, isCurrentAccount && { color: colors.B1 }]}>
          {isLoadingBalance && (
            <View style={{ marginRight: scale(8) }}>
              <ActivityIndicator size="small" color={colors.N2} />
            </View>
          )}
          {toFormattedNumber(data.balance?.displayBalance) || 0} CSPR
        </Text>
      </Col>
      <Col>
        {!isCurrentAccount ? (
          <TouchableOpacity onPress={() => onDeleteWallet(data)}>
            <IconTrash width={scale(16)} height={scale(16)} fill={colors.R1} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: scale(16), height: scale(16) }} />
        )}
      </Col>
    </Row.LR>
  );
};

export default AccountItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: scale(14),
    marginRight: scale(8),
  },
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  body: {
    ...textStyles.Body1,
  },
  sub: {
    ...textStyles.Sub1,
    alignSelf: 'flex-start',
  },
  editActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginLeft: scale(14),
    marginTop: scale(2),
  },
});
