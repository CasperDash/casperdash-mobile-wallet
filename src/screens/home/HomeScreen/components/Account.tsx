import React, { useRef } from 'react';
import { View, Text, StyleSheet, Platform, UIManager } from 'react-native';
import { CButton, Col, Row } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconPencilFilled, IconCopy } from 'assets';
import { AccountActions } from 'screens/home/HomeScreen/data/data';
import ButtonAction from 'screens/home/HomeScreen/components/ButtonAction';
import { useSelector } from 'react-redux';
import {
  getAccountTotalBalanceInFiat,
  getAllTokenInfo,
  getPublicKey,
} from 'utils/selectors/user';
import { toFormattedCurrency } from 'utils/helpers/format';
import { useNavigation } from '@react-navigation/native';
import SelectAccountModal from 'screens/home/HomeScreen/components/SelectAccountModal';
import { WalletInfoDetails } from 'utils/helpers/account';
import { useCopyToClipboard } from 'utils/hooks/useCopyClipboard';

function Account() {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const copyToClipboard = useCopyToClipboard();
  const publicKey = useSelector(getPublicKey);
  const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);
  const allTokenInfo = useSelector(getAllTokenInfo);
  const { navigate } = useNavigation();
  const selectAccountModalRef = useRef<any>();
  const selectedWallet = useSelector<any, WalletInfoDetails>(
    (state: any) => state.user.selectedWallet || {},
  );

  /*TODO: follow the figma's design*/
  // const onToggleAmount = () => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setIsShowAmount(i => !i);
  // };

  const saveKey = () => {
    copyToClipboard(publicKey);
  };

  const navigateSendReceive = (screen: string) => {
    const params = {
      token: allTokenInfo.find(token => token.address === 'CSPR'),
    };
    navigate(screen, params);
  };

  const onShowSelectAccountModal = () => {
    selectAccountModalRef.current.show();
  };

  return (
    <View style={styles.container}>
      <Col px={16} py={16} style={styles.accountContainer}>
        <Row.LR>
          <CButton
            onPress={onShowSelectAccountModal}
            style={{ maxWidth: scale(343 - 16) / 2 }}>
            <Row.C>
              <Text numberOfLines={1} style={styles.titleAccount}>
                {selectedWallet?.walletInfo?.descriptor?.name || ''}
              </Text>
              <IconPencilFilled width={scale(16)} height={scale(16)} />
            </Row.C>
          </CButton>

          <CButton onPress={saveKey} style={{ maxWidth: scale(343 - 16) / 2 }}>
            <Row.C>
              <Text
                numberOfLines={1}
                ellipsizeMode={'middle'}
                style={[styles.titleAccount, { maxWidth: scale(100) }]}>
                {publicKey}
              </Text>
              <IconCopy width={scale(16)} height={scale(16)} />
            </Row.C>
          </CButton>
        </Row.LR>
        <Row.C mx={16} mt={20} mb={24}>
          <Text
            numberOfLines={1}
            style={[textStyles.H3, { marginRight: scale(8) }]}>
            {toFormattedCurrency(totalFiatBalance)}
          </Text>
          {/*TODO: follow the figma's design*/}
          {/*<CButton onPress={onToggleAmount}>
                        {isShowAmount ? <IconEye width={scale(20)} height={scale(14)}/> :
                            <IconEyeOff width={scale(20)} height={scale(19)}/>}
                    </CButton>*/}
        </Row.C>
        <Row.C>
          {AccountActions.map((action, index) => {
            return (
              <ButtonAction
                data={action}
                key={index}
                onPress={navigateSendReceive}
              />
            );
          })}
        </Row.C>
      </Col>
      <SelectAccountModal ref={selectAccountModalRef} />
    </View>
  );
}

export default Account;

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    backgroundColor: colors.cF8F8F8,
    paddingBottom: scale(16),
  },
  accountContainer: {
    width: scale(343),
    backgroundColor: colors.W1,
    borderRadius: scale(24),
    alignSelf: 'center',
  },
  titleAccount: {
    ...textStyles.Body2,
    marginRight: scale(10),
  },
});
