import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { toFormattedNumber } from 'utils/helpers/format';
import { StatusColorMapping } from 'utils/helpers/transaction';
import { DeployStatus } from 'utils/constants/key';
import { IValidatorDetailsResponse } from 'services/Validators/validatorsApis';

interface Props {
  value: any;
  validatorsDetail?: IValidatorDetailsResponse;
}

const StakedHistoryItem = ({ value, validatorsDetail }: Props) => {
  const TypeIcon = value.icon;
  const validatorDetail = validatorsDetail?.[value.validator];
  return (
    <Row mx={16} py={16} style={styles.container}>
      {TypeIcon && <TypeIcon width={scale(24)} height={scale(24)} />}
      <Row.LR pl={16} style={{ flex: 1 }}>
        <Col.TL>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {validatorDetail?.name || value.validator || ''}
          </Text>
          <Text style={[textStyles.Body2]}>{value.type}</Text>
        </Col.TL>
        <Col.TR>
          {value.stakedAmount !== null && value.stakedAmount !== undefined && (
            <Text style={textStyles.Sub1}>{`${toFormattedNumber(value.stakedAmount ?? 0)} CSPR`}</Text>
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
});
