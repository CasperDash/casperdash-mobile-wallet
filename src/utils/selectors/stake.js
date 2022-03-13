import { createSelector } from 'reselect';
import { Config, Keys } from 'utils';

export const getConfirmedStakesGroupByValidator =
  () =>
  ({ stakes = {} }) => {
    if (stakes.delegations) {
      let groupByValidators = [];
      stakes.delegations.forEach(stake => {
        const { validator, amount, status } = stake;
        const foundValidator = groupByValidators.findIndex(
          item => validator === item.validator,
        );
        const amountKey = `${status}Amount`;
        if (foundValidator < 0) {
          const amountObj = {};
          amountObj[amountKey] = amount;
          groupByValidators.push({
            validator,
            ...amountObj,
          });
        } else {
          if (!groupByValidators[foundValidator][amountKey]) {
            groupByValidators[foundValidator][amountKey] = 0 + amount;
          } else {
            groupByValidators[foundValidator][amountKey] += amount;
          }
        }
      });
      return groupByValidators;
    }
    return [];
  };

export const getDeployStakes = createSelector(
  state => state.main,
  (_, params) => params,
  (main, params) => {
    const { publicKey, status, symbol } = params;
    const { deploysStakes } = main;
    if (deploysStakes) {
      const stakesByPublicKey = deploysStakes[publicKey] || [];
      return stakesByPublicKey.filter(
        stake =>
          (symbol ? stake.symbol === symbol : true) &&
          (status ? stake.status === status : true),
      );
    }
    return [];
  },
);

export const updateStakesDeployStatus = async (
  publicKey,
  path,
  listHash = [],
) => {
  const deployStorageValue = (await Config.getItem(Keys.deploysStakes)) || {};
  const deployStorageValueByPublicKey = deployStorageValue[publicKey] || [];

  if (deployStorageValueByPublicKey.length > 0) {
    deployStorageValue[publicKey] = deployStorageValueByPublicKey.map(
      deploy => {
        if (!deploy.deployHash) {
          return deploy;
        }
        const hashStatus = listHash.find(
          item =>
            item.hash &&
            item.hash.toLowerCase() === deploy.deployHash.toLowerCase(),
        );
        return {
          ...deploy,
          status: hashStatus ? hashStatus.status : deploy.status,
        };
      },
    );
  }
  await Config.saveItem(Keys.deploysStakes, deployStorageValue);
};
