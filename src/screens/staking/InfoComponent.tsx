import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { toFormattedNumber } from 'utils/helpers/format';
import { Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { ENTRY_POINT_REDELEGATE } from 'utils/constants/key';

interface Props {
  validator: string;
  amount: number;
  fee: number;
  newValidator?: string;
  entryPoint?: string;
}

const InfoComponent = ({ validator, amount, fee, newValidator, entryPoint }: Props) => {
  return (
    <Col pt={24}>
      <Text style={styles.caption}>Validator</Text>
      <Text style={styles.value}>{validator}</Text>
      {entryPoint === ENTRY_POINT_REDELEGATE && (
        <>
          <Text style={styles.caption}>New Validator</Text>
          <Text style={styles.value}>{newValidator}</Text>
        </>
      )}
      <Text style={styles.caption}>Amount</Text>
      <Text style={styles.value}>{`${toFormattedNumber(Number(amount))} CSPR`}</Text>
      <Text style={styles.caption}>Network Fee</Text>
      <Text style={styles.value}>{`${fee} CSPR`}</Text>
      <Text style={styles.caption}>Entry Point</Text>
      <Text style={styles.value}>{entryPoint}</Text>
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
