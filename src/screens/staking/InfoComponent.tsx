import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { toFormattedNumber } from 'utils/helpers/format';
import { Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';

interface Props {
  validator: string;
  amount: number;
  fee: number;
}

const InfoComponent = ({ validator, amount, fee }: Props) => {
  return (
    <Col pt={24}>
      <Text style={styles.caption}>Validator</Text>
      <Text style={styles.value}>{validator}</Text>
      <Text style={styles.caption}>Amount</Text>
      <Text style={styles.value}>{`${toFormattedNumber(Number(amount))} CSPR`}</Text>
      <Text style={styles.caption}>Network Fee</Text>
      <Text style={styles.value}>{`${fee} CSPR`}</Text>
    </Col>
  );
};

export default InfoComponent;

const styles = StyleSheet.create({
  caption: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  value: {
    ...textStyles.Sub1,
    color: colors.N2,
    marginTop: scale(5),
    marginBottom: scale(16),
  },
});
