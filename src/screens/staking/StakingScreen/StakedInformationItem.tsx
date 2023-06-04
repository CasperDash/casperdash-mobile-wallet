import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { toFormattedNumber } from 'utils/helpers/format';
import MainRouter from 'navigation/stack/MainRouter';
import { useNavigation } from '@react-navigation/native';
import { StakingMode } from 'utils/constants/key';
import { IValidatorDetailsResponse } from 'services/Validators/validatorsApis';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { IStakedInfo } from 'utils/hooks/useStakeDeploys';
import { toCSPR } from 'utils/helpers/currency';

interface Props {
  value: IStakedInfo;
  validatorsDetail?: IValidatorDetailsResponse;
}

function StakedInformationItem({ value, validatorsDetail }: Props) {
  const { navigate } = useNavigation();
  const validatorDetail = validatorsDetail?.[value.validatorPublicKey];

  const undelegate = () => {
    navigate(MainRouter.STAKING_CONFIRM_SCREEN, {
      name: StakingMode.Undelegate,
      validator: value.validatorPublicKey,
      stakedAmount: value.stakedAmount,
    });
  };

  return (
    <Row mx={16} py={16} style={styles.container}>
      <Image
        source={{ uri: validatorDetail?.logo || getBase64IdentIcon(value.validatorPublicKey) }}
        style={styles.validatorLogo}
      />
      <Row.LR style={{ flex: 1 }}>
        <Col.TL>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {validatorDetail?.name || value.validatorPublicKey || ''}
          </Text>
          <CTextButton
            onPress={undelegate}
            text={'Undelegate'}
            type={'line'}
            textStyle={styles.textStyle}
            style={styles.btnUnDelegate}
          />
        </Col.TL>
        <Col.TR>
          {value.stakedAmount !== null && value.stakedAmount !== undefined && (
            <Text style={textStyles.Sub1}>{`${toFormattedNumber(
              toCSPR(value.stakedAmount ?? 0).toNumber(),
            )} CSPR`}</Text>
          )}
          {(!!value.pendingDelegatedAmount || !!value.pendingUndelegatedAmount) && (
            <View style={styles.pendingContainer}>
              <View style={styles.circle} />
              <Text style={[textStyles.Body2]}>{`${
                value.pendingDelegatedAmount
                  ? toFormattedNumber(value.pendingDelegatedAmount)
                  : -toFormattedNumber(value.pendingUndelegatedAmount)
              } CSPR`}</Text>
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
  validatorLogo: { width: scale(32), height: scale(32), resizeMode: 'contain', marginRight: scale(8) },
});
