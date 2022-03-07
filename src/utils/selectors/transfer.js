import { createSelector } from 'reselect';
import { Config, Keys } from 'utils';

export const getDeploysTransfer = createSelector(
  state => state.main,
  (_, params) => params,
  (main, params) => {
    const { publicKey, status, symbol } = params;
    const { deploysTransfer } = main;
    if (deploysTransfer) {
      const transferByPublicKey = deploysTransfer[publicKey] || [];
      return transferByPublicKey.filter(
        transfer =>
          (symbol ? transfer.symbol === symbol : true) &&
          (status ? transfer.status === status : true),
      );
    }
    return [];
  },
);

export const updateTransferDeployStatus = async (
  publicKey,
  path,
  listHash = [],
) => {
  const deployStorageValue = (await Config.getItem(Keys.deploysTransfer)) || {};
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
  await Config.saveItem(Keys.deploysTransfer, deployStorageValue);
};
