import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, IconLogo, textStyles, IconUp, IconDown } from 'assets';
import { CButton, CLayout, Row, Col } from 'components';
import { scale } from 'device';
import TransactionComponent from 'screens/market/components/TransactionComponent';
import ChartComponent from 'screens/market/components/ChartComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentPrice } from 'utils/selectors';
import { getCSPRMarketInfo, getPriceHistory } from 'utils/selectors/price';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';

function MarketScreen() {
  const insets = useSafeAreaInsets();
  const [isRefreshing, setRefreshing] = useState<boolean>(false);

  const onRefresh = () => {
    setRefreshing(false);
  };

  const rowInfo = [
    {
      title: 'MarketCap',
      value: '$512.89 B',
    },
    {
      title: '24h Volume',
      value: '$12.89 B',
    },
    {
      title: 'Total Supply',
      value: '10,522,076,853',
    },
    {
      title: 'Circulating supply',
      value: '2,777,948,726',
    },
  ];

  const dispatch = useDispatch();
  const priceHistory = useSelector(getPriceHistory);
  const currentPrice = useSelector(getCurrentPrice);
  const data = useSelector((state: any) => state.home.CSPRMarketInfo);
  const csprMarketInfo = data && data.length ? data[0] : {};
  console.log('priceHistory', priceHistory);
  console.log('currentPrice', currentPrice);
  console.log('csprMarketInfo', csprMarketInfo);
  console.log('data', data);
  useEffect(() => {
    getPriceHistoryInfo();
  }, []);

  const getPriceHistoryInfo = () => {
    dispatch(
      allActions.market.getPriceHistory((error: any, data: any) => {
        if (error) {
          const message = {
            message: error && error.message ? error.message : 'Error',
            type: MessageType.error,
          };
          dispatch(allActions.main.showMessage(message));
        }
      }),
    );
  };

  const _renderRowInfo = () => {
    return (
      <Row style={styles.rowInfoContainer}>
        {rowInfo.map((item, index) => {
          return (
            <Col key={index} style={styles.infoItem}>
              <Text style={styles.label}>{item.title}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <CLayout bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <Row.L pl={24} pr={16} pt={10} pb={20}>
          <Row style={styles.alignCenter}>
            <IconLogo width={scale(28)} height={scale(28)} />
            <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>
              Market
            </Text>
          </Row>
        </Row.L>
        <ScrollView
          nestedScrollEnabled={true}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}>
          <Col px={16}>
            <Text style={styles.head1}>CASPER (CSPR)</Text>
            <Row mt={16} style={styles.alignCenter}>
              <Text style={textStyles.H5}>$32,128.80</Text>
              <IconUp
                width={scale(10)}
                height={scale(10)}
                style={styles.iconArrow}
              />
              <Text style={styles.label}>2.5%</Text>
            </Row>
            <ChartComponent data={priceHistory} />
            {_renderRowInfo()}
          </Col>
          <TransactionComponent />
        </ScrollView>
      </View>
    </CLayout>
  );
}

export default MarketScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
  topContainer: {},
  alignCenter: {
    alignItems: 'center',
  },
  head1: {
    ...textStyles.Sub2,
    fontWeight: '700',
    fontFamily: fonts.Poppins.bold,
  },
  label: {
    ...textStyles.Body2,
    color: colors.N3,
  },
  iconArrow: {
    marginLeft: scale(13),
    marginRight: scale(8),
  },
  value: {
    ...textStyles.Sub1,
    marginTop: scale(8),
  },
  rowInfoContainer: {
    width: '100%',
    flexWrap: 'wrap',
  },
  infoItem: {
    width: '50%',
    marginTop: scale(20),
  },
});
