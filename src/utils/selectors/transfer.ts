import { createSelector } from 'reselect';

import { IDeployStatusResponse } from 'services/Deploy/deployApis';
import { Config, Keys } from 'utils';

/* It's a selector, which is a function that returns a value from a state. */
export const getDeploysTransfer = createSelector(
  (state: any) => state.main,
  (_: any, params: any) => params,
  (main, params) => {
    const { publicKey, status, symbol } = params;
    const { deploysTransfer } = main;
    if (deploysTransfer) {
      const transferByPublicKey = deploysTransfer[publicKey] || [];
      return transferByPublicKey.filter(
        (transfer: any) => (symbol ? transfer.symbol === symbol : true) && (status ? transfer.status === status : true),
      );
    }
    return [];
  },
);

/**
 * Update the deploy status of the transfer deploys
 * @param publicKey - The public key of the user who initiated the transfer.
 * @param path - The path to the file that contains the deploy.
 * @param [listHash] - A list of deploys that have been deployed.
 */
export const updateTransferDeployStatus = async (publicKey: string, listHash?: IDeployStatusResponse[]) => {
  if (!listHash?.length) {
    return;
  }
  const deployStorageValue = (await Config.getItem(Keys.deploysTransfer)) || {};
  const deployStorageValueByPublicKey = deployStorageValue[publicKey] || [];

  if (deployStorageValueByPublicKey.length > 0) {
    deployStorageValue[publicKey] = deployStorageValueByPublicKey.map((deploy: any) => {
      if (!deploy.deployHash) {
        return deploy;
      }
      const hashStatus: any = listHash?.find(
        (item: any) => item.hash && item.hash.toLowerCase() === deploy.deployHash.toLowerCase(),
      );
      return {
        ...deploy,
        status: hashStatus ? hashStatus.status : deploy.status,
      };
    });
  }
  await Config.saveItem(Keys.deploysTransfer, deployStorageValue);
};
