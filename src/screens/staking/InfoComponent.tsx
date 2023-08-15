import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { toFormattedNumber } from 'utils/helpers/format';
import { Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { ENTRY_POINT_REDELEGATE } from 'utils/constants/key';
import { Validator } from 'redux_manager/staking/staking_reducer';
import ValidatorItem from 'screens/staking/components/ValidatorItem';

interface Props {
  validator: Validator;
  amount: number;
  fee: number;
  newValidator?: Validator;
  entryPoint?: string;
}

const InfoComponent = ({ validator, amount, fee, newValidator, entryPoint }: Props) => {
  return (
    <Col pt={24}>
      <Text style={styles.caption}>Validator</Text>
      <View style={styles.value}>
        <ValidatorItem publicKey={validator.publicKey} logo={validator.logo} name={validator.name} />
      </View>
      {entryPoint === ENTRY_POINT_REDELEGATE && (
        <>
          <Text style={styles.caption}>New Validator</Text>
          <View style={styles.value}>
            <ValidatorItem publicKey={newValidator?.publicKey} logo={newValidator?.logo} name={newValidator?.name} />
          </View>
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
