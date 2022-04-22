import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScreenProps } from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import {
  colors,
  IconExchange,
  IconReload,
  IconSetting,
  IconSwap,
  textStyles,
} from 'assets';
import { CButton, CHeader, CLayout, Col, Row } from 'components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import SelectDropdown from 'react-native-select-dropdown';
import DropdownItem from 'screens/home/SendScreen/DropdownItem';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { getAllTokenInfo, getTokenInfoByAddress } from 'utils/selectors';
import { toFormattedNumber } from 'utils/helpers/format';
import SwapDropdownComponent from 'screens/home/SwapScreen/SwapDropdownComponent';
import { ListPercents, Percent } from 'screens/home/SwapScreen/data/data';
import PercentItem from 'screens/home/SwapScreen/PercentItem';

// @ts-ignore
const SwapScreen: React.FC<ScreenProps<MainRouter.SWAP_SCREEN>> = ({
  route,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { replace, navigate } = useNavigation<StackNavigationProp<any>>();
  const { token } = route.params;
  const allTokenInfo = useSelector(getAllTokenInfo);

  const [swapFromPercent, setSwapFromPercent] = useState<Percent>();
  const [swapFromTokenAddress, setSwapFromTokenAddress] = useState(
    token ? token.address : 'CSPR',
  );
  const selectedTokenSwapFrom = useSelector(
    getTokenInfoByAddress({ address: swapFromTokenAddress }),
  );

  const [listTokenSwapTo, setListTokenSwapTo] =
    useState<any>(
      allTokenInfo &&
        allTokenInfo.filter(
          (tokenInfo: any) =>
            tokenInfo.symbol !== selectedTokenSwapFrom?.symbol,
        ),
    ) || [];

  const [swapToTokenAddress, setSwapToTokenAddress] = useState(
    (listTokenSwapTo &&
      listTokenSwapTo.find(i => i.address !== swapFromTokenAddress)?.address) ||
      '',
  );
  const selectedTokenSwapTo = useSelector(
    getTokenInfoByAddress({ address: swapToTokenAddress }),
  );

  const onSelectedTokenSwapFrom = (item: any) => {
    const address = item && item.address ? item.address : '';
    setSwapFromTokenAddress(address);
    setSwapFromPercent(undefined);
    const listTokenSwapToData =
      allTokenInfo && allTokenInfo.filter(i => i.address !== address);
    setListTokenSwapTo(listTokenSwapToData);
    setSwapToTokenAddress(
      (listTokenSwapToData &&
        listTokenSwapToData[0] &&
        listTokenSwapToData[0].address) ||
        '',
    );
  };

  const onSelectedTokenSwapTo = (item: any) => {
    setSwapToTokenAddress(item && item.address ? item.address : '');
  };

  const openTransactionSetting = () => {
    navigate(MainRouter.TRANSACTION_SETTING_SCREEN);
  };

  const _renderSwapFrom = () => {
    return (
      <>
        <Row.LR>
          <Text style={[styles.title, { marginTop: 0 }]}>Swap from</Text>
          <Text style={[styles.title, styles.titleBalance]}>
            Balance:{' '}
            {selectedTokenSwapFrom && selectedTokenSwapFrom.balance
              ? toFormattedNumber(
                  selectedTokenSwapFrom.balance.displayValue ?? 0,
                )
              : ''}
          </Text>
        </Row.LR>
        <SelectDropdown
          dropdownStyle={[styles.rowPicker, styles.dropdownStyle]}
          buttonStyle={styles.rowPicker}
          dropdownOverlayColor={'rgba(0,0,0,0.1)'}
          defaultValue={selectedTokenSwapFrom}
          renderCustomizedButtonChild={(item: any, index) => {
            if (!item) {
              return null;
            }
            const balance =
              (selectedTokenSwapFrom &&
                selectedTokenSwapFrom.balance &&
                selectedTokenSwapFrom.balance.displayValue) ||
              0;
            const value = swapFromPercent
              ? (swapFromPercent.value * balance) / 100
              : 0;
            return (
              <SwapDropdownComponent
                item={item}
                key={index}
                value={toFormattedNumber(value)}
              />
            );
          }}
          renderCustomizedRowChild={(item: any, index) => (
            <DropdownItem item={item} key={index} />
          )}
          data={allTokenInfo}
          onSelect={onSelectedTokenSwapFrom}
          buttonTextAfterSelection={item => item}
          rowTextForSelection={item => item}
        />
        <Row.LR mt={16}>
          {ListPercents.map((percent, index: number) => {
            return (
              <PercentItem
                key={index}
                data={percent}
                isSelected={swapFromPercent && swapFromPercent.id >= index}
                onSelectPercent={setSwapFromPercent}
                length={ListPercents.length}
              />
            );
          })}
        </Row.LR>
      </>
    );
  };

  const _renderSwapTo = () => {
    return (
      <>
        <Row.LR>
          <Text style={styles.title}>Swap to</Text>
          <Text style={[styles.title, styles.titleBalance]}>
            Balance:{' '}
            {selectedTokenSwapTo && selectedTokenSwapTo.balance
              ? toFormattedNumber(selectedTokenSwapTo.balance.displayValue ?? 0)
              : ''}
          </Text>
        </Row.LR>
        <SelectDropdown
          dropdownStyle={[styles.rowPicker, styles.dropdownStyle]}
          buttonStyle={styles.rowPicker}
          dropdownOverlayColor={'rgba(0,0,0,0.1)'}
          defaultValue={selectedTokenSwapTo}
          renderCustomizedButtonChild={(item: any, index) => {
            if (!item) {
              return null;
            }
            const defaultBalance =
              (selectedTokenSwapFrom &&
                selectedTokenSwapFrom.balance &&
                selectedTokenSwapFrom.balance.displayValue) ||
              0;
            const balance = swapFromPercent
              ? (swapFromPercent.value * defaultBalance) / 100
              : 0;
            //TODO: replace 0.02 (example: 1 CSPR ~ 0.02 ETH)
            const value = balance * 0.02;
            return (
              <SwapDropdownComponent
                item={item}
                key={index}
                value={toFormattedNumber(value)}
              />
            );
          }}
          renderCustomizedRowChild={(item: any, index) => (
            <DropdownItem item={item} key={index} />
          )}
          data={listTokenSwapTo}
          onSelect={onSelectedTokenSwapTo}
          buttonTextAfterSelection={item => item}
          rowTextForSelection={item => item}
        />
      </>
    );
  };

  const _renderRightHeader = () => {
    return (
      <Row>
        <CButton onPress={openTransactionSetting} style={styles.circleBtn}>
          <IconSetting width={scale(21)} height={scale(21)} />
        </CButton>
        <CButton
          onPress={() => {}}
          style={[styles.circleBtn, { marginLeft: scale(18) }]}>
          <IconReload width={scale(21)} height={scale(21)} />
        </CButton>
      </Row>
    );
  };

  const _renderInfoContainer = () => {
    return (
      <Col mt={12} style={styles.infoContainer}>
        <Row.LR style={styles.infoItemContainer}>
          <Text style={styles.infoTitle}>Rate</Text>
          <Text style={styles.infoTitle}>1 CSPR = 0.02 ETH</Text>
        </Row.LR>
        <Row.LR style={styles.infoItemContainer}>
          <Text style={styles.infoTitle}>Estimate network fee</Text>
          <Text style={styles.infoTitle}>0.002 CSPR ~ $2</Text>
        </Row.LR>
        <Row.LR style={styles.infoItemContainer}>
          <Text style={styles.infoTitle}>Slippage</Text>
          <Text style={styles.infoTitle}>2%</Text>
        </Row.LR>
      </Col>
    );
  };

  return (
    <CLayout
      statusBgColor={colors.cF8F8F8}
      edges={['right', 'top', 'left']}
      bgColor={colors.cF8F8F8}>
      <CHeader
        title={'Swap'}
        renderRight={_renderRightHeader}
        style={{ backgroundColor: colors.cF8F8F8 }}
      />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainerStyle,
            { paddingBottom: bottom + scale(20) },
          ]}>
          {_renderSwapFrom()}
          <Row.C style={styles.iconSwap}>
            <IconSwap width={scale(20)} height={scale(20)} />
          </Row.C>
          {_renderSwapTo()}
          <Row style={styles.rowCenter}>
            <Text
              style={[
                styles.title,
                styles.titleBalance,
                { marginTop: scale(20), marginRight: scale(10) },
              ]}>{`1 ${
              selectedTokenSwapFrom && selectedTokenSwapFrom.symbol
                ? selectedTokenSwapFrom.symbol
                : ''
            } ~ 0.02 ${
              selectedTokenSwapTo && selectedTokenSwapTo.symbol
                ? selectedTokenSwapTo.symbol
                : ''
            }`}</Text>
            <IconExchange width={scale(15)} height={scale(15)} />
          </Row>
          <CTextButton
            style={styles.btnConfirm}
            onPress={() => {}}
            text={'Swap'}
          />
          {_renderInfoContainer()}
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
};

export default SwapScreen;

const styles = StyleSheet.create({
  container: {
    width: scale(375),
    flex: 1,
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    paddingTop: scale(16),
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginTop: scale(24),
    marginBottom: scale(16),
  },
  titleBalance: {
    color: colors.N2,
    fontWeight: '400',
    fontSize: scale(16),
  },
  rowPicker: {
    width: scale(343),
    minHeight: scale(48),
    maxHeight: scale(100),
    backgroundColor: colors.N5,
    borderRadius: scale(16),
    borderWidth: 0,
  },
  btnConfirm: {
    alignSelf: 'center',
    marginTop: scale(34),
  },
  dropdownStyle: {
    borderRadius: scale(10),
  },
  circleBtn: {
    width: scale(42),
    height: scale(42),
    borderRadius: scale(21),
    backgroundColor: colors.W1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    width: '100%',
    textAlign: 'left',
    paddingLeft: scale(5),
  },
  iconSwap: {
    backgroundColor: 'rgba(251, 210, 211, 0.5)',
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    marginTop: scale(24),
    alignSelf: 'center',
  },
  rowCenter: {
    alignItems: 'center',
  },
  infoContainer: {
    width: scale(343),
    alignSelf: 'center',
    borderRadius: scale(16),
    borderWidth: scale(1),
    borderColor: colors.N5,
    paddingVertical: scale(6),
  },
  infoTitle: {
    ...textStyles.Body2,
    maxWidth: '50%',
  },
  infoItemContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(16),
    minHeight: scale(40),
  },
});
