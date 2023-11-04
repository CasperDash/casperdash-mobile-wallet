import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Platform, UIManager } from 'react-native';
import { CButton, Col, Row } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconPencilFilled, IconCopy } from 'assets';
import { AccountActions } from 'screens/home/HomeScreen/data/data';
import ButtonAction from 'screens/home/HomeScreen/components/ButtonAction';
import { useSelector } from 'react-redux';
import { getPublicKey, getLoginOptions } from 'utils/selectors/user';
import { toFormattedCurrency } from 'utils/helpers/format';
import { copyToClipboard } from 'utils/hooks/useCopyClipboard';
import { CONNECTION_TYPES } from 'utils/constants/settings';
import { useTokenInfoByPublicKey } from 'utils/hooks/useTokenInfo';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import { BuyButton } from 'components/BuyButton';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { isIos } from 'device';
import MainRouter from 'navigation/stack/MainRouter';

function Account() {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const publicKey = useSelector(getPublicKey);
  const loginOptions = useSelector(getLoginOptions);

  const { allTokenInfo, accountTotalBalanceInFiat: totalFiatBalance } = useTokenInfoByPublicKey(publicKey);
  const { navigate } = useStackNavigation();
  const selectedWallet = useSelector<any, IAccountInfo>((state: any) => state.user.selectedWallet || {});
  const { data: configuration } = useConfigurations();

  const canEditAccount = useMemo(() => {
    return loginOptions?.connectionType === CONNECTION_TYPES.viewMode;
  }, [loginOptions]);

  const saveKey = async () => {
    await copyToClipboard(publicKey);
  };

  const navigateSendReceive = (screen: string) => {
    const params = {
      token: allTokenInfo.find((token) => token.address === 'CSPR'),
    };
    navigate(screen, params);
  };

  const onEditAccount = () => {
    if (!canEditAccount) {
      navigate(MainRouter.ACCOUNT_LIST_SCREEN);
    }
  };

  return (
    <View style={styles.container}>
      <Col px={16} py={16} style={styles.accountContainer}>
        <Row.LR>
          <CButton onPress={onEditAccount} style={{ maxWidth: scale(343 - 16) / 2 }}>
            <Row.C>
              <Text numberOfLines={1} style={styles.titleAccount}>
                {loginOptions?.connectionType === CONNECTION_TYPES.viewMode
                  ? 'View mode'
                  : selectedWallet?.walletInfo?.descriptor?.name || ''}
              </Text>
              {!canEditAccount && <IconPencilFilled width={scale(16)} height={scale(16)} />}
            </Row.C>
          </CButton>

          <CButton onPress={saveKey} style={{ maxWidth: scale(343 - 16) / 2 }}>
            <Row.C>
              <Text numberOfLines={1} ellipsizeMode={'middle'} style={[styles.titleAccount, { maxWidth: scale(100) }]}>
                {publicKey}
              </Text>
              <IconCopy width={scale(16)} height={scale(16)} />
            </Row.C>
          </CButton>
        </Row.LR>
        <Row.C mx={16} mt={20} mb={24}>
          <Text numberOfLines={1} style={[textStyles.H3, { marginRight: scale(8) }]}>
            {toFormattedCurrency(totalFiatBalance)}
          </Text>
        </Row.C>
        <Row.C>
          {AccountActions.map((action, index) => {
            return <ButtonAction data={action} key={index} onPress={navigateSendReceive} />;
          })}
          {configuration?.ENABLE_BUY_IOS && isIos() && <BuyButton />}
          {configuration?.ENABLE_BUY_ANDROID && !isIos() && <BuyButton />}
        </Row.C>
      </Col>
    </View>
  );
}

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
