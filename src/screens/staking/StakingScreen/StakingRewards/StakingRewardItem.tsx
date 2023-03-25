import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { toCSPR } from 'utils/helpers/currency';
import { IStakingRewardItem } from 'services/StakingRewards/stakingRewardsType';
import moment from 'moment';
import { IValidatorDetailsResponse } from 'services/Validators/validatorsApis';
import { getBase64IdentIcon } from 'utils/helpers/identicon';

interface Props {
  value: IStakingRewardItem;
  validatorsDetail?: IValidatorDetailsResponse;
}

export const StakingRewardItem = ({ value, validatorsDetail }: Props) => {
  const detail = validatorsDetail?.[value.validatorPublicKey];

  return (
    <Row mx={16} py={16} style={styles.container}>
      <Row.LR style={{ flex: 1 }}>
        <Row>
          <Image
            source={{ uri: detail?.logo || getBase64IdentIcon(value.validatorPublicKey) }}
            style={styles.validatorLogo}
          />
          <Col.TL>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
              {(detail?.name || value.validatorPublicKey) ?? ''}
            </Text>
            <Text style={[textStyles.Body2]}>{value.eraId}</Text>
          </Col.TL>
        </Row>
        <Col.TR>
          <Text style={textStyles.Sub1}>{`${toCSPR(value.amount ?? 0)} CSPR`}</Text>

          <View style={styles.pendingContainer}>
            <Text style={textStyles.Body2}>{moment(value.timestamp).format('YYYY/MM/DD HH:ss')}</Text>
          </View>
        </Col.TR>
      </Row.LR>
    </Row>
  );
};

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
  validatorLogo: { width: scale(32), height: scale(32), resizeMode: 'contain', marginRight: scale(8) },
});
