import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { toFormattedNumber } from 'utils/helpers/format';
import { StatusColorMapping } from 'utils/helpers/transaction';
import { DeployStatus, ENTRY_POINT_REDELEGATE } from 'utils/constants/key';
import { IValidatorDetailsResponse } from 'services/Validators/validatorsApis';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { IHistoryInfo } from 'utils/hooks/useStakeDeploys';

interface Props {
  value: IHistoryInfo;
  validatorsDetail?: IValidatorDetailsResponse;
}

const StakedHistoryItem = ({ value, validatorsDetail }: Props) => {
  const validatorDetail = validatorsDetail?.[value.validatorPublicKey];
  return (
    <Row mx={16} py={16} style={styles.container}>
      <Image
        source={{ uri: validatorDetail?.logo || getBase64IdentIcon(value.validatorPublicKey) }}
        style={styles.validatorLogo}
      />
      <Row.LR style={styles.row}>
        <Col.TL style={styles.rowContent}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {validatorDetail?.name || value.validatorPublicKey || ''}
          </Text>
          <Text style={styles.description} numberOfLines={1} ellipsizeMode={'tail'}>
            {value.type}
            {value.type === ENTRY_POINT_REDELEGATE && value.newValidatorName ? ` to ${value.newValidatorName}` : ''}
          </Text>
        </Col.TL>
        <Col.TR style={styles.rowFooter}>
          {value.stakedAmount !== null && value.stakedAmount !== undefined && (
            <Text style={textStyles.Sub1}>{`${toFormattedNumber(value.stakedAmount)} CSPR`}</Text>
          )}

          <View style={styles.pendingContainer}>
            <Text style={[textStyles.Body2, { color: StatusColorMapping[value.status as DeployStatus] }]}>
              {value.status}
            </Text>
          </View>
        </Col.TR>
      </Row.LR>
    </Row>
  );
};

export default StakedHistoryItem;

const styles = StyleSheet.create({
  container: {
    width: scale(375 - 16 * 2),
    alignItems: 'center',
  },
  title: {
    ...textStyles.Sub1,
    width: scale(130),
  },
  row: {
    flex: 1,
  },
  description: {
    ...textStyles.Body2,
    flex: 1,
  },
  type: {
    ...textStyles.Body1,
    width: scale(130),
  },
  btnUnDelegate: {
    width: scale(125),
    height: scale(32),
    marginTop: scale(12),
  },
  textStyle: {
    ...textStyles.Body2,
  },
  rowContent: {
    flex: 1,
  },
  rowFooter: {
    flexBasis: scale(100),
  },
  circle: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(10 / 2),
    backgroundColor: colors.Y1,
    marginRight: scale(8),
  },
  pendingContainer: {
    marginTop: scale(4),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  validatorLogo: { width: scale(32), height: scale(32), resizeMode: 'contain', marginRight: scale(8) },
});
