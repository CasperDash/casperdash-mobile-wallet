import React, { useState } from 'react';
import { Text, StyleSheet, ActivityIndicator, View, TouchableOpacity } from 'react-native';
import { Row, Col, CButton, CInput } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconPencilFilled, IconCheck, IconCloseAlt } from 'assets';
import { toFormattedNumber } from 'utils/helpers/format';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';

interface IAccountItemProps {
  data: IAccountInfo;
  isCurrentAccount: boolean;
  onSelectWallet: (data: IAccountInfo) => void;
  isLoadingBalance?: boolean;
  isEditing?: boolean;
  setEditingAccountUid: React.Dispatch<React.SetStateAction<string>>;
  onUpdateWalletName: (walletInfoDetails: IAccountInfo, newName: string, isCurrentWallet: boolean) => void;
}

const AccountItem = ({
  data,
  isCurrentAccount,
  onSelectWallet,
  isLoadingBalance,
  setEditingAccountUid,
  isEditing,
  onUpdateWalletName,
}: IAccountItemProps) => {
  const [name, setName] = useState(data.walletInfo?.descriptor.name);

  const resetEditingState = () => {
    setEditingAccountUid('');
  };

  const onUpdateName = () => {
    if (!name) {
      return;
    }
    onUpdateWalletName(data, name, isCurrentAccount);
    resetEditingState();
  };

  return (
    <>
      <Row.LR my={10} style={styles.container}>
        {!isEditing ? (
          <>
            <Col style={styles.leftContent}>
              {!data.isLedger && (
                <TouchableOpacity onPress={() => setEditingAccountUid(data.walletInfo.uid)}>
                  <IconPencilFilled width={scale(16)} height={scale(16)} />
                </TouchableOpacity>
              )}
              <CButton onPress={() => onSelectWallet(data)} style={{ marginLeft: scale(16) }}>
                <Text style={[styles.sub, isCurrentAccount && { color: colors.B1 }]}>
                  {data?.walletInfo?.descriptor?.name || ''}
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
              <TouchableOpacity onPress={() => resetEditingState()}>
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
