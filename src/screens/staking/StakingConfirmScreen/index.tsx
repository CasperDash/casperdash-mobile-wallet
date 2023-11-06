import React from 'react';
import { colors, textStyles } from 'assets';
import { CLayout, Col, CHeader } from 'components';
import { scale } from 'device';
import { Text, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CTextButton from 'components/CTextButton';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicKey } from 'utils/selectors';
import InfoComponent from 'screens/staking/InfoComponent';
import { StakingMode } from 'utils/constants/key';
import { useConfirmDeploy } from 'utils/hooks/useConfirmDeploy';
import { allActions } from 'redux_manager';
import StakingRouter from 'navigation/StakingNavigation/StakingRouter';
import { useNavigation } from '@react-navigation/native';
import { getStakeDeploy } from 'utils/services/stakeServices';
import { MessageType } from 'components/CMessge/types';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { getStakingForm } from 'utils/selectors/staking';
import { STAKING_NOTE_MESSAGE, DELEGATE_TIME_NOTICE } from 'utils/constants/staking';
import { useGetFeeByEntryPoint } from 'utils/hooks/useGetFeeByEntryPoint';
import { ListItem } from '@rneui/base';
import { usePrice } from 'utils/hooks/usePrice';

const HOUR_IN_YEAR = 365 * 24;

const calculateRewards = (amount: number, hours: number, apy?: number, fee?: number): string => {
  if (!apy) {
    return 'N/A';
  }
  const rewards = ((amount * apy) / HOUR_IN_YEAR) * hours;
  return `${(rewards * (1 - (fee || 0))).toFixed(2)} CSPR`;
};

const StakingConfirmScreen = () => {
  const { validator: stakedValidator, name, amount, newValidator, entryPoint } = useSelector(getStakingForm);
  const { data: configurations } = useConfigurations();
  const publicKey = useSelector(getPublicKey)!;
  const { navigate } = useNavigation<any>();
  const dispatch = useDispatch();
  const [showRewardsEst, setShowRewardsEst] = React.useState(false);

  const { executeDeploy, isDeploying } = useConfirmDeploy();
  const { data: priceInfo } = usePrice();
  const { fee } = useGetFeeByEntryPoint(entryPoint);

  const isRedelegate = name === StakingMode.Redelegate;
  const validatorFee = (isRedelegate ? stakedValidator.fee : newValidator.fee) / 100;

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
          {name === StakingMode.Delegate && (
            <>
              <ListItem.Accordion
                content={<Text style={styles.rewardsEstTitle}>Rewards Estimation</Text>}
                isExpanded={showRewardsEst}
                containerStyle={{ padding: scale(0) }}
                onPress={() => setShowRewardsEst(!showRewardsEst)}
              >
                <Text style={styles.rewardsEstItem}>
                  Per Era (~2 Hours): {calculateRewards(Number(amount), 2, priceInfo?.apy, validatorFee)}
                </Text>
                <Text style={styles.rewardsEstItem}>
                  Per Day: {calculateRewards(Number(amount), 24, priceInfo?.apy, validatorFee)}
                </Text>
                <Text style={styles.rewardsEstItem}>
                  Per Week: {calculateRewards(Number(amount), 24 * 7, priceInfo?.apy, validatorFee)}
                </Text>
                <Text style={styles.rewardsEstItem}>
                  Per Month: {calculateRewards(Number(amount), 24 * 30, priceInfo?.apy, validatorFee)}
                </Text>
                <Text style={styles.rewardsEstItem}>
                  Per Year: {calculateRewards(Number(amount), 24 * 365, priceInfo?.apy, validatorFee)}
                </Text>
              </ListItem.Accordion>
              <Text style={styles.notes}>{configurations?.DELEGATE_TIME_NOTICE || DELEGATE_TIME_NOTICE}</Text>
            </>
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
  rewardsEstTitle: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  rewardsEstItem: {
    ...textStyles.Sub1,
    color: colors.N2,
    marginTop: scale(4),
    marginBottom: scale(4),
  },
});
