import React from 'react';
import {
  View,
  Text,
  Platform,
  UIManager,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Col, Row } from 'components';
import { scale } from 'device';
import { colors, textStyles } from 'assets';
import { toFormattedCurrency, toFormattedNumber } from 'utils/helpers/format';
import { AccountActions } from 'screens/home/HomeScreen/data/data';
import ButtonAction from 'screens/home/HomeScreen/components/ButtonAction';

interface Props {
  tokenInfo: any;
}

const TokenInfoComponent = ({ tokenInfo }: Props) => {
  if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const { navigate } = useNavigation();

  const navigateSendReceive = (screen: string) => {
    const params = {
      token: tokenInfo,
    };
    navigate(screen, params);
  };

  return (
    <View style={styles.container}>
      <Col px={16} pt={24} pb={16} style={styles.accountContainer}>
        <Col.C>
          {tokenInfo.symbol && (
            <Image
              source={
                tokenInfo.symbol === 'CSPR'
                  ? tokenInfo.icon
                  : { uri: tokenInfo.icon }
              }
              style={styles.symbol}
            />
          )}
          <Text style={styles.amount}>{`${
            tokenInfo.balance &&
            toFormattedNumber(tokenInfo.balance.displayValue)
          } ${tokenInfo.symbol}`}</Text>
          <Text style={styles.amount2}>
            ~ {toFormattedCurrency(tokenInfo.totalPrice)}
          </Text>
        </Col.C>
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
    </View>
  );
};

export default TokenInfoComponent;

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
  symbol: {
    width: scale(40),
    height: scale(40),
  },
  amount: {
    ...textStyles.H3,
    marginTop: scale(16),
    textAlign: 'center',
  },
  amount2: {
    ...textStyles.Body1,
    marginTop: scale(4),
    marginBottom: scale(24),
    textAlign: 'center',
    color: colors.N3,
  },
});
