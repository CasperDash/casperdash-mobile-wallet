import React from 'react';
import { Text, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Row, Col } from 'components';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import CTextButton from 'components/CTextButton';
import { toFormattedNumber } from 'utils/helpers/format';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StakingMode } from 'utils/constants/key';
import { IValidatorDetailsResponse } from 'services/Validators/validatorsApis';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { IStakedInfo } from 'utils/hooks/useStakeDeploys';
import { toCSPR } from 'utils/helpers/currency';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

interface Props {
  value: IStakedInfo;
  validatorsDetail?: IValidatorDetailsResponse;
}

function StakedInformationItem({ value, validatorsDetail }: Props) {
  const dispatch = useDispatch();
  const { navigate, setParams } = useNavigation<NavigationProp<any>>();
  const validatorDetail = validatorsDetail?.[value.validatorPublicKey];

  const undelegate = () => {
    dispatch(
      allActions.staking.setStakingForm({
        name: StakingMode.Undelegate,
        stakedAmount: Number(value.stakedAmount),
        validator: {
          name: validatorDetail?.name ?? value.validatorPublicKey,
          logo: validatorDetail?.logo ?? getBase64IdentIcon(value.validatorPublicKey),
          publicKey: value.validatorPublicKey,
        },
      }),
    );
    navigate(StakingRouter.MAIN, {
      screen: StakingRouter.UNDELEGATE_FORM_SCREEN,
    });
  };

  const handleOnPress = () => {
    const selectedValidator = {
      name: validatorDetail?.name ?? '',
      description: validatorDetail?.description ?? '',
      logo: validatorDetail?.logo ?? '',
      icon: getBase64IdentIcon(value.validatorPublicKey, { size: 100 }),
      priority: validatorDetail?.priority ?? 0,
      validatorPublicKey: value.validatorPublicKey,
    };

    setParams({ selectedValidator });
  };

  return (
    <Row mx={16} py={16} style={styles.container}>
      <Image
        source={{ uri: validatorDetail?.logo || getBase64IdentIcon(value.validatorPublicKey) }}
        style={styles.validatorLogo}
      />
      <TouchableOpacity style={styles.touchableItem} onPress={handleOnPress}>
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
      </TouchableOpacity>
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
  touchableItem: {
    flex: 1,
  },
  validatorLogo: { width: scale(32), height: scale(32), resizeMode: 'contain', marginRight: scale(8) },
});
