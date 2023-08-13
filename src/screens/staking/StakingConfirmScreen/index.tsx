import React, { useState } from 'react';
import { colors, textStyles } from 'assets';
import { CLayout, Col, CHeader } from 'components';
import { scale } from 'device';
import { Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTextButton from 'components/CTextButton';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicKey } from 'utils/selectors';
import InfoComponent from 'screens/staking/InfoComponent';
import { ENTRY_POINT_REDELEGATE, StakingMode } from 'utils/constants/key';
import { useConfirmDeploy } from 'utils/hooks/useConfirmDeploy';
import { allActions } from 'redux_manager';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { useNavigation } from '@react-navigation/native';
import { getStakeDeploy } from 'utils/services/stakeServices';
import { MessageType } from 'components/CMessge/types';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { getStakingForm } from 'utils/selectors/staking';
import { STAKING_NOTE_MESSAGE } from 'utils/constants/staking';
import { useGetFeeByEntryPoint } from 'utils/hooks/useGetFeeByEntryPoint';

const StakingConfirmScreen = () => {
  const { validator: stakedValidator, name, amount, newValidator, entryPoint } = useSelector(getStakingForm);
  const { data: configurations } = useConfigurations();
  const publicKey = useSelector(getPublicKey)!;
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();

  const { executeDeploy, isDeploying } = useConfirmDeploy();

  const { fee } = useGetFeeByEntryPoint(entryPoint);

  const showMessage = (message: string, type?: string) => {
    const messages = {
      message: message,
      type: type ?? MessageType.normal,
    };
    dispatch(allActions.main.showMessage(messages, type && type !== MessageType.normal ? 2000 : 30000));
  };

  const onConfirm = async () => {
    if (isDeploying) {
      return;
    }

    try {
      const amountDeploy: number = amount;

      const buildDeployFn = () =>
        getStakeDeploy({
          fromAddress: publicKey,
          validator: stakedValidator.publicKey,
          fee: fee,
          amount: amountDeploy,
          entryPoint,
          newValidator: newValidator.publicKey,
        });
      const { deployHash, signedDeploy } = await executeDeploy(buildDeployFn, showMessage);
      if (deployHash) {
        dispatch(
          allActions.staking.pushStakeToLocalStorage(publicKey, {
            amount: Number(amountDeploy),
            entryPoint,
            fee: fee,
            fromAddress: publicKey,
            validator: stakedValidator.publicKey,
            deployHash: deployHash,
            status: 'pending',
            newValidator: newValidator.publicKey,
            newValidatorName: newValidator.name,
            // @ts-ignore
            timestamp: signedDeploy?.deploy?.header.timestamp,
          }),
        );
        navigate('Staking', {
          screen: StakingRouter.STAKING_SCREEN,
          params: {
            selectedValidator: null,
          },
        });
      }
    } catch (e: any) {
      showMessage(e.message ?? `${name} failed`, MessageType.error);
    }
  };

  return (
    <CLayout statusBgColor={colors.cF8F8F8} bgColor={colors.cF8F8F8}>
      <CHeader title={name} style={{ backgroundColor: colors.cF8F8F8 }} />
      <Col mt={16} style={styles.container}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainerStyle}
        >
          <InfoComponent
            validator={stakedValidator}
            amount={amount}
            fee={fee}
            newValidator={newValidator}
            entryPoint={entryPoint}
          />
          {name === StakingMode.Undelegate && (
            <Text style={styles.notes}>{configurations?.UNDELEGATE_TIME_NOTICE || STAKING_NOTE_MESSAGE}</Text>
          )}
          <CTextButton onPress={onConfirm} text={'Confirm'} style={[styles.btnStaking]} />
        </KeyboardAwareScrollView>
      </Col>
    </CLayout>
  );
};

export default StakingConfirmScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(70),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  btnStaking: {
    marginBottom: scale(20),
  },
  notes: {
    ...textStyles.Body2,
    color: colors.N3,
    marginTop: scale(16),
    marginBottom: scale(16),
  },
});
