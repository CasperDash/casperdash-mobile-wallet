import { UseMutationOptions, useMutation } from 'react-query';
import { Config, Keys } from 'utils';
import { NFTHistory } from '../types/nftHistory';

type Result = [NFTHistory];

export const useAddHistory = (options?: UseMutationOptions<Result, unknown, NFTHistory>) => {
  const mutation = useMutation({
    ...options,
    mutationFn: async ({ fromPublicKeyHex, ...rest }: NFTHistory): Promise<Result> => {
      const history = {
        fromPublicKeyHex,
        ...rest,
      };

      let deploysTransferNFT = await Config.getItem(Keys.deploysTransferNFT);
      deploysTransferNFT = deploysTransferNFT || {};
      if (deploysTransferNFT?.[fromPublicKeyHex]) {
        const listStakes = deploysTransferNFT[fromPublicKeyHex] || [];
        listStakes.push(history);
        deploysTransferNFT[fromPublicKeyHex] = listStakes;
      } else {
        deploysTransferNFT[fromPublicKeyHex] = [history];
      }

      await Config.saveItem(Keys.deploysTransferNFT, deploysTransferNFT);

      return deploysTransferNFT;
    },
  });

  return {
    ...mutation,
    addHistory: mutation.mutate,
    addHistoryAsync: mutation.mutateAsync,
  };
};
