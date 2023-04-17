import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moteToCspr } from '../helpers/balance';
import { getDeployStakes, updateStakesDeployStatus } from '../selectors/stake';
import { getListValidators } from '../selectors/validator';
import { ENTRY_POINT_UNDELEGATE, DeployStatus } from '../constants/key';
import { IconStatusReceive, IconStatusSend } from 'assets';
import { allActions } from 'redux_manager';
import { useDeployStatus } from './useDeployStatus';
import { useQuery } from 'react-query';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { getAccountDelegation } from 'services/User/userApis';

export const useStakedInfo = (publicKey: string) => {
  const query = useQuery({
    queryKey: [ERequestKeys.accountDelegation, publicKey],
    queryFn: () => getAccountDelegation(publicKey),
  });
  return query;
};

/**
 * It returns an icon based on the value of the stake
 * @param {number} value - number - the value of the transaction
 * @returns the value of the IconStatusReceive or IconStatusSend.
 */
export const getStakeIcon = (value: number) => {
  return value > 0 ? IconStatusReceive : IconStatusSend;
};

/**
 * Get staked validators and add the pending amount.
 *
 * @param {Array} validators
 * @param {Array} pendingStakes
 * @param {String} publicKey
 * @returns
 */
const getStakedValidators = (validators: any, pendingStakes: any, publicKey: string) => {
  let stakedValidators: any = [];
  if (!publicKey || !validators.length) {
    return stakedValidators;
  }
  validators.forEach((validator: any) => {
    if (!validator.bidInfo) {
      return;
    }
    const foundDelegator = validator.bidInfo.bid.delegators.find(
      (delegator: any) => delegator.public_key && delegator.public_key.toLowerCase() === publicKey.toLowerCase(),
    );
    if (!foundDelegator) {
      return;
    }

    const { public_key: validatorPublicKey } = validator;
    const pendingStake = pendingStakes.find((stake: any) => stake.validator === validatorPublicKey);
    let stakedValidator: any = {
      validator: validatorPublicKey,
      stakedAmount: moteToCspr(foundDelegator.staked_amount),
      icon: IconStatusReceive,
    };
    if (pendingStake) {
      const pendingAmount =
        pendingStake.entryPoint === ENTRY_POINT_UNDELEGATE ? -pendingStake.amount : pendingStake.amount;
      stakedValidator.pendingAmount = pendingAmount;
      stakedValidator.icon = getStakeIcon(pendingAmount);
    }
    stakedValidators.push(stakedValidator);
  });

  pendingStakes
    .filter((stake: any) => stakedValidators.findIndex((item: any) => item.validator === stake.validator) < 0)
    .forEach((newStakedValidator: any) =>
      stakedValidators.push({
        validator: newStakedValidator.validator,
        pendingAmount: newStakedValidator.amount,
        icon: IconStatusReceive,
      }),
    );

  return stakedValidators;
};

export const useStakeFromValidators = (publicKey: string) => {
  const dispatch = useDispatch();

  const validators = useSelector(getListValidators());
  const stakeDeployList = useSelector((state) =>
    //@ts-ignore
    getDeployStakes(state, { publicKey }),
  );
  const pendingStakes = stakeDeployList.filter((stake: any) => stake.status === DeployStatus.pending);
  const pendingUndelegate = stakeDeployList.filter((stake: any) => stake.status === DeployStatus.undelegating);

  const { data } = useDeployStatus(pendingStakes.concat(pendingUndelegate).map((deploy: any) => deploy.deployHash));

  useEffect(() => {
    if (data?.length) {
      (async () => {
        if (!publicKey) {
          return;
        }

        await updateStakesDeployStatus(publicKey, data);
        dispatch(allActions.main.loadLocalStorage());
      })();
    }
  }, [data, dispatch, publicKey]);

  const stakedValidators = getStakedValidators(validators, pendingStakes, publicKey);
  return stakedValidators;
};

export const useStakedHistory = (publicKey: string) => {
  const stakeDeployList = useSelector((state) =>
    //@ts-ignore
    getDeployStakes(state, { publicKey }),
  );
  return stakeDeployList.map((item: any) => {
    return {
      validator: item.validator,
      stakedAmount: item.entryPoint === ENTRY_POINT_UNDELEGATE ? -item.amount : item.amount,
      icon: item.entryPoint === ENTRY_POINT_UNDELEGATE ? IconStatusSend : IconStatusReceive,
      status: item.status,
      type: item.entryPoint,
    };
  });
};
