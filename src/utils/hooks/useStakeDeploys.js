import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { moteToCspr } from '../helpers/balance';
import { getDeployStakes, updateStakesDeployStatus } from '../selectors/stake';
import { getListValidators } from '../selectors/validator';
import { ENTRY_POINT_UNDELEGATE } from '../constants/key';
import { IconStatusReceive, IconStatusSend } from 'assets';
import { apis } from 'services';
import { Keys } from 'utils';
import { allActions } from 'redux_manager';

export const getStakeIcon = value => {
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
const getStakedValidators = (validators, pendingStakes, publicKey) => {
  let stakedValidators = [];
  if (!publicKey || !validators.length) {
    return stakedValidators;
  }
  console.log('zo day', validators);
  validators.forEach(validator => {
    if (!validator.bidInfo) {
      return;
    }
    const foundDelegator = validator.bidInfo.bid.delegators.find(
      delegator =>
        delegator.public_key &&
        delegator.public_key.toLowerCase() === publicKey.toLowerCase(),
    );
    console.log('foundDelegator', foundDelegator);
    if (!foundDelegator) {
      return;
    }

    const { public_key: validatorPublicKey } = validator;
    console.log('validatorPublicKey', validatorPublicKey);
    const pendingStake = pendingStakes.find(
      pendingStake => pendingStake.validator === validatorPublicKey,
    );
    console.log('pendingStake ===', pendingStake);
    let stakedValidator = {
      validator: validatorPublicKey,
      stakedAmount: moteToCspr(foundDelegator.staked_amount),
      icon: IconStatusReceive,
    };
    if (pendingStake) {
      console.log('pendingStake pendingStake pendingStake', pendingStake);
      const pendingAmount =
        pendingStake.entryPoint === ENTRY_POINT_UNDELEGATE
          ? -pendingStake.amount
          : pendingStake.amount;
      stakedValidator.pendingAmount = pendingAmount;
      stakedValidator.icon = getStakeIcon(pendingAmount);
    }
    stakedValidators.push(stakedValidator);
  });

  pendingStakes
    .filter(
      stake =>
        stakedValidators.findIndex(item => item.validator === stake.validator) <
        0,
    )
    .forEach(newStakedValidator =>
      stakedValidators.push({
        validator: newStakedValidator.validator,
        pendingAmount: newStakedValidator.amount,
        // icon: getStakeIcon(newStakedValidator.amount),
      }),
    );

  return stakedValidators;
};

export const useStakeFromValidators = publicKey => {
  const dispatch = useDispatch();

  const validators = useSelector(getListValidators());
  console.log('validators', validators);
  const stakeDeployList = useSelector(state =>
    getDeployStakes(state, { publicKey }),
  );
  console.log('stakeDeployList', stakeDeployList);
  const pendingStakes = stakeDeployList.filter(
    stake => stake.status === 'pending',
  );
  console.log('pendingStakes', pendingStakes);
  useEffect(() => {
    if (pendingStakes && pendingStakes.length > 0) {
      (async () => {
        if (!publicKey) {
          return;
        }
        const pendingStakesDeployHash = pendingStakes.map(
          deploy => deploy.deployHash,
        );
        const data = await apis.getTransferDeploysStatusAPI({
          deployHash: pendingStakesDeployHash,
        });
        await updateStakesDeployStatus(publicKey, Keys.deploysTransfer, data);
        dispatch(allActions.main.loadLocalStorage());
      })();
    }
  }, [JSON.stringify(pendingStakes), dispatch]);

  const stakedValidators = getStakedValidators(
    validators,
    pendingStakes,
    publicKey,
  );
  return stakedValidators;
};
