import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { toFormattedNumber } from 'utils/helpers/format';
import MainRouter from 'navigation/stack/MainRouter';
import { useNavigation } from '@react-navigation/native';
import { StakingMode } from 'utils/constants/key';

interface Props {
  value: any;
}

function StakedInformationItem({ value }: Props) {
  const { navigate } = useNavigation();

  const StatusIcon = value.icon;
  const undelegate = () => {
    navigate(MainRouter.STAKING_CONFIRM_SCREEN, {
      name: StakingMode.Undelegate,
      validator: value.validator,
      stakedAmount: value.stakedAmount,
    });
  };

  return (
    <Row mx={16} py={16} style={styles.container}>
      {StatusIcon && <StatusIcon width={scale(24)} height={scale(24)} />}
      <Row.LR pl={16} style={{ flex: 1 }}>
        <Col.TL>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {value.validator ?? ''}
          </Text>
          <CTextButton
            onPress={undelegate}
            text={'Undelegate'}
            type={'line'}
            textStyle={styles.textStyle}
            style={styles.btnUnDelegate}
            disabled={!!value.pendingAmount}
          />
        </Col.TL>
        <Col.TR>
          {value.stakedAmount !== null && value.stakedAmount !== undefined && (
            <Text style={textStyles.Sub1}>{`${toFormattedNumber(value.stakedAmount ?? 0)} CSPR`}</Text>
          )}
          {value.pendingAmount !== null && value.pendingAmount !== undefined && (
            <View style={styles.pendingContainer}>
              <View style={styles.circle} />
              <Text style={[textStyles.Body2]}>{`${toFormattedNumber(value.pendingAmount)} CSPR`}</Text>
            </View>
          )}
        </Col.TR>
      </Row.LR>
    </Row>
  );
}

export default StakedInformationItem;

const styles = StyleSheet.create({
  container: {
    width: scale(375 - 16 * 2),
    alignItems: 'center',
  },
  title: {
    ...textStyles.Sub1,
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
