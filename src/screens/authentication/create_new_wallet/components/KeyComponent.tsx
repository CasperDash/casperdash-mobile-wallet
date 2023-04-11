import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { scale } from 'device';
import { Row, Col, CButton } from 'components';
import { colors, textStyles } from 'assets';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { toFormattedNumber } from 'utils/helpers/format';
import { CASPER_SYMBOL } from 'utils/constants/key';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';

interface Props {
  value: IAccountInfo;
  index: number;
  onPress: (token: any) => void;
}

const KeyComponent = ({ value, onPress, index }: Props) => {
  return (
    <CButton onPress={() => onPress(value)}>
      <Row.LR mx={16} style={styles.container}>
        <Row>
          <Image source={{ uri: getBase64IdentIcon(value.publicKey) }} style={styles.symbol} />
          <Col mx={12}>
            <Text numberOfLines={1} ellipsizeMode={'middle'} style={[styles.titleAccount, { maxWidth: scale(100) }]}>
              {value.publicKey}
            </Text>
            <Text style={styles.body2}>Key #{index}</Text>
          </Col>
        </Row>
        <Col.R mx={12}>
          <Text style={styles.sub1}>{`${toFormattedNumber(
            value.balance.displayBalance.toNumber(),
          )} ${CASPER_SYMBOL}`}</Text>
        </Col.R>
      </Row.LR>
    </CButton>
  );
};

export default KeyComponent;

const styles = StyleSheet.create({
  container: {
    height: scale(80),
    width: scale(343),
    alignItems: 'center',
    alignSelf: 'center',
    borderBottomWidth: scale(1),
    borderColor: colors.N5,
  },
  symbol: {
    width: scale(40),
    height: scale(40),
  },
  sub1: {
    ...textStyles.Sub1,
  },
  body2: {
    ...textStyles.Body2,
    marginTop: scale(4),
  },
  titleAccount: {
    ...textStyles.Body2,
    marginRight: scale(10),
  },
});
