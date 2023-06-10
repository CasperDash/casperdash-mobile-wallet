import React, { useState } from 'react';
import { Text, StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { Row, Col, CButton, CInput } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconPencilFilled, IconCheck, IconCloseAlt } from 'assets';
import { WalletInfoDetails } from 'utils/helpers/account';
import { toFormattedNumber } from 'utils/helpers/format';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';

interface IAccountItemProps {
  data: WalletInfoDetails & IAccountInfo;
  isCurrentAccount: boolean;
  onSelectWallet: (data: WalletInfoDetails) => void;
  isLoadingBalance?: boolean;
  onUpdateWalletName: (walletInfoDetails: WalletInfoDetails, newName: string, isCurrentAccount: boolean) => void;
}

const AccountItem = ({
  data,
  isCurrentAccount,
  onSelectWallet,
  isLoadingBalance,
  onUpdateWalletName,
}: IAccountItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.walletInfo.descriptor.name);

  const onUpdateName = () => {
    if (!name) {
      return;
    }
    onUpdateWalletName(data, name, isCurrentAccount);
    setIsEditing(false);
  };

  return (
    <>
      <Row.LR my={10} style={styles.container}>
        {!isEditing ? (
          <>
            <Col style={styles.leftContent}>
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <IconPencilFilled width={scale(16)} height={scale(16)} />
              </TouchableOpacity>
              <CButton onPress={() => onSelectWallet(data)} style={{ marginLeft: scale(16) }}>
                <Text style={[styles.sub, isCurrentAccount && { color: colors.B1 }]}>
                  {data && data.walletInfo.descriptor && data.walletInfo.descriptor.name
                    ? data.walletInfo.descriptor.name
                    : ''}
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
          </>
        ) : (
          <>
            <Col style={styles.leftContent}>
              <CInput
                value={name}
                inputStyle={{ ...styles.body, height: scale(30) }}
                containerStyle={{ width: scale(210), height: scale(30), marginLeft: scale(8) }}
                onChangeText={(value) => setName(value)}
              />
            </Col>
            <Col style={styles.editActions}>
              <TouchableOpacity onPress={onUpdateName}>
                <IconCheck width={scale(26)} height={scale(26)} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsEditing(false)}>
                <IconCloseAlt width={scale(22)} height={scale(22)} />
              </TouchableOpacity>
            </Col>
          </>
        )}
      </Row.LR>
    </>
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
    textAlign: 'right',
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
