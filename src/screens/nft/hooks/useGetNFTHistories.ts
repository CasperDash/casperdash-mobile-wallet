import { Config, Keys } from 'utils';
import { NFTHistory } from '../types/nftHistory';
import { UseQueryOptions, useQuery } from 'react-query';
import { DeployStatus } from 'utils/constants/key';
import { getDeployStatus } from 'services/Deploy/deployApis';

type Result = NFTHistory[];

const sortHistories = (histories: NFTHistory[]) => {
  return histories.sort((a, b) => {
    return new Date(b.timestamp ?? '').getTime() - new Date(a.timestamp ?? '').getTime();
  });
};

/**
 * Get NFT histories
 * @param {string} publicKey - string - the public key of the user
 * @param {UseQueryOptions} options - react-query options
 * @returns the list of NFT histories.
 *
 */
export const useGetNFTHistories = (publicKey: string, options?: UseQueryOptions<Result, unknown, Result, string[]>) => {
  return useQuery({
    ...options,
    queryKey: [Keys.deploysTransferNFT, publicKey],
    queryFn: async (): Promise<Result> => {
      const deploysTransferNFT = await Config.getItem(Keys.deploysTransferNFT);
      if (deploysTransferNFT?.[publicKey]) {
        let listHistories = deploysTransferNFT[publicKey];
        // Get status for pending histories
        const pendingHistories = listHistories.filter((item: NFTHistory) => item.status === DeployStatus.pending);

        if (pendingHistories.length === 0) {
          return sortHistories(listHistories);
        }

        const deployStatuses = await getDeployStatus(pendingHistories.map((item: NFTHistory) => item.deployHash));

        const newHistories = deploysTransferNFT[publicKey].map((history: NFTHistory) => {
          const foundDeployStatus = deployStatuses.find((item) => item.hash === history.deployHash);

          // Update status for pending histories
          if (foundDeployStatus) {
            return {
              ...history,
              status: foundDeployStatus.status,
            };
          }

          return history;
        });

        // Update status for all histories
        const newDeploysTransferNFT = {
          ...deploysTransferNFT,
          [publicKey]: sortHistories(newHistories),
        };

        await Config.saveItem(Keys.deploysTransferNFT, newDeploysTransferNFT);

        return newDeploysTransferNFT[publicKey];
      }

      return [];
    },
  });
};
