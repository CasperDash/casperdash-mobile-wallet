import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { colors, fonts, IconLogo, textStyles, IconUp, IconDown } from 'assets';
import { CLayout, Row, Col } from 'components';
import { scale } from 'device';
import TransactionComponent from 'screens/market/components/TransactionComponent';
import ChartComponent from 'screens/market/components/ChartComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getPriceHistory } from 'utils/selectors/price';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { useScrollToTop } from '@react-navigation/native';
import { toFormattedCurrency, toFormattedNumber } from 'utils/helpers/format';
import { usePrice } from 'utils/hooks/usePrice';

const getIcon = (type: string) => {
  return type === 'up' ? (
    <IconUp width={scale(10)} height={scale(10)} style={styles.iconArrow} />
  ) : (
    <IconDown width={scale(10)} height={scale(10)} style={styles.iconArrow} />
  );
};

function MarketScreen() {
  const dispatch = useDispatch();
  const scrollViewRef = useRef<any>();
  useScrollToTop(scrollViewRef);

  const priceHistory = useSelector(getPriceHistory);
  const { data: csprMarketInfo, currentPrice } = usePrice();

  const [isScrollable, setScrollable] = useState<boolean>(true);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);

  const rowInfo = [
    {
      title: 'MarketCap',
      value: toFormattedCurrency(csprMarketInfo?.market_cap),
    },
    {
      title: '24h Volume',
      value: toFormattedCurrency(csprMarketInfo?.volume_24h),
    },
    {
      title: 'Total Supply',
      value: toFormattedNumber(csprMarketInfo?.total_supply),
    },
    {
      title: 'Circulating supply',
      value: toFormattedNumber(csprMarketInfo?.circulating_supply),
    },
  ];

  useEffect(() => {
    getPriceHistoryInfo();
  }, []);

  const getPriceHistoryInfo = () => {
    dispatch(
      allActions.market.getPriceHistory((error: any) => {
        setRefreshing(false);
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

  const onRefresh = () => {
    setRefreshing(true);
    getPriceHistoryInfo();
  };

  const onActivated = () => {
    if (isScrollable) {
      setScrollable(false);
    }
  };

  const onDeactivated = () => {
    if (!isScrollable) {
      setScrollable(true);
    }
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
    <CLayout edges={['top', 'left', 'right']} bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <Row.L pl={24} pr={16} pt={10} pb={16} style={{ backgroundColor: colors.cF8F8F8 }}>
          <Row style={styles.alignCenter}>
            <IconLogo width={scale(28)} height={scale(28)} />
            <Text style={[textStyles.H3, { marginLeft: scale(16) }]}>Market</Text>
          </Row>
        </Row.L>
        <ScrollView
          ref={scrollViewRef}
          scrollEnabled={isScrollable}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              style={{ backgroundColor: colors.cF8F8F8 }}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Col px={16} style={{ backgroundColor: colors.cF8F8F8 }}>
            <Text style={styles.head1}>CASPER (CSPR)</Text>
            <Row mt={8} ml={8} style={styles.alignCenter}>
              <Text style={textStyles.H5}>
                {toFormattedCurrency(currentPrice, {
                  maximumSignificantDigits: 4,
                })}
              </Text>
              {csprMarketInfo?.price_change_percentage_24h && csprMarketInfo?.price_change_percentage_24h < 0
                ? getIcon('down')
                : getIcon('up')}
              <Text
                style={[
                  styles.label,
                  {
                    color:
                      csprMarketInfo?.price_change_percentage_24h && csprMarketInfo?.price_change_percentage_24h >= 0
                        ? colors.c5FC88F
                        : colors.cFA2852,
                  },
                ]}
              >
                {toFormattedNumber(csprMarketInfo?.price_change_percentage_24h, {
                  maximumSignificantDigits: 3,
                })}
                %
              </Text>
            </Row>
            <ChartComponent data={priceHistory} onDeactivated={onDeactivated} onActivated={onActivated} />
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
    backgroundColor: colors.W1,
  },
  topContainer: {},
  alignCenter: {
    alignItems: 'center',
  },
  head1: {
    ...textStyles.Sub2,
    fontWeight: '700',
    fontFamily: fonts.Poppins.bold,
    marginLeft: scale(8),
  },
  label: {
    ...textStyles.Body2,
    color: colors.N3,
  },
  iconArrow: {
    marginLeft: scale(10),
    marginRight: scale(5),
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
