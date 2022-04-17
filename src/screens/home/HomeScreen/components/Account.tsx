import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { CButton, Col, Row } from 'components';
import { scale } from 'device';
import {
  colors,
  textStyles,
  IconEyeOff,
  IconEye,
  IconPencilFilled,
  IconCopy,
  images,
} from 'assets';
import { AccountActions } from 'screens/home/HomeScreen/data/data';
import ButtonAction from 'screens/home/HomeScreen/components/ButtonAction';
import Clipboard from '@react-native-clipboard/clipboard';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAccountTotalBalanceInFiat,
  getAllTokenInfo,
  getPublicKey,
} from 'utils/selectors/user';
import { toFormattedCurrency } from 'utils/helpers/format';
import { useNavigation } from '@react-navigation/native';
import SelectAccountModal from 'screens/home/HomeScreen/components/SelectAccountModal';

function Account() {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const dispatch = useDispatch();
  const [isShowAmount, setIsShowAmount] = useState<boolean>(true);
  const publicKey = useSelector(getPublicKey);
  const totalFiatBalance = useSelector(getAccountTotalBalanceInFiat);
  const allTokenInfo = useSelector(getAllTokenInfo);
  const { navigate } = useNavigation();
  const selectAccountModalRef = useRef<any>();
  const selectedWallet = useSelector(
    (state: any) => state.main.selectedWallet || {},
  );

  {
    /*TODO: follow the figma's design*/
  }
  const onToggleAmount = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsShowAmount(i => !i);
  };

  const saveKey = () => {
    Clipboard.setString(publicKey);
    const message = {
      message: 'Copied to Clipboard',
      type: MessageType.normal,
    };
    dispatch(allActions.main.showMessage(message, 1000));
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
                {selectedWallet &&
                selectedWallet.descriptor &&
                selectedWallet.descriptor.name
                  ? selectedWallet.descriptor.name
                  : ''}
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
            {isShowAmount ? toFormattedCurrency(totalFiatBalance) : '$*****00'}
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
