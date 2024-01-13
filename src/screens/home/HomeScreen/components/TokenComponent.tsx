import React from 'react';
import { Text, StyleSheet, Image, View } from 'react-native';
import { scale } from 'device';
import { Row, Col, CButton } from 'components';
import { colors, textStyles } from 'assets';
import { toFormattedCurrency, toFormattedNumber } from 'utils/helpers/format';
import { ITokenInfo } from 'utils/hooks/useTokenInfo';

interface Props {
  value: ITokenInfo;
  onPress: (token: ITokenInfo) => void;
}

const TokenComponent = ({ value, onPress }: Props) => {
  return (
    <CButton onPress={() => onPress(value)}>
      <Row.LR mx={16} style={styles.container}>
        <Row>
          {!!value.symbol && (
            <View style={{ ...styles.symbolContainer, backgroundColor: value.backgroundColor || colors.R2 }}>
              <Image source={{ uri: value.icon }} style={styles.symbol} />
            </View>
          )}
          <Col mx={12}>
            <Text style={styles.sub1}>{value.symbol ?? ''}</Text>
            <Text style={styles.body2}>
              {value.balance ? toFormattedNumber(value.balance.displayValue) : '0'}{' '}
              {value.totalStakedAmount || value.undelegatingAmount
                ? `(${toFormattedNumber((value.undelegatingAmount ?? 0) + (value.totalStakedAmount ?? 0))})`
                : ''}
            </Text>
          </Col>
        </Row>
        <Col.R mx={12}>
          <Text style={styles.sub1}>{toFormattedCurrency(value.totalValue)}</Text>
          <Text style={styles.body2}>
            {toFormattedCurrency(value.price ?? 0, {
              minimumFractionDigits: 4,
            })}
          </Text>
        </Col.R>
      </Row.LR>
    </CButton>
  );
};

export default TokenComponent;

const styles = StyleSheet.create({
  container: {
    height: scale(80),
    width: scale(343),
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: scale(1),
    borderColor: colors.N5,
  },
  symbolContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: scale(40),
    height: scale(40),
    borderRadius: scale(9999),
  },
  symbol: {
    width: scale(18),
    height: scale(18),
  },
  sub1: {
    ...textStyles.Sub1,
  },
  body2: {
    ...textStyles.Body2,
    marginTop: scale(4),
  },
});
