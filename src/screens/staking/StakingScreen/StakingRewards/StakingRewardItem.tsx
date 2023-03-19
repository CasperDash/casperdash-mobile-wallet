import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { toCSPR } from 'utils/helpers/currency';
import { IStakingRewardItem } from 'services/StakingRewards/stakingRewardsType';
import moment from 'moment';

interface Props {
  value: IStakingRewardItem;
}

export const StakingRewardItem = ({ value }: Props) => {
  return (
    <Row mx={16} py={16} style={styles.container}>
      <Row.LR pl={16} style={{ flex: 1 }}>
        <Col.TL>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {value.validatorPublicKey ?? ''}
          </Text>
          <Text style={[textStyles.Body2]}>{value.era}</Text>
        </Col.TL>
        <Col.TR>
          <Text style={textStyles.Sub1}>{`${toCSPR(
            value.amount ?? 0,
          )} CSPR`}</Text>

          <View style={styles.pendingContainer}>
            <Text style={textStyles.Body2}>
              {moment(value.createdAt).format('YYYY/MM/DD HH:ss')}
            </Text>
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
});
