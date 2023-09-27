import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

import { useConfirmDeploy } from 'utils/hooks/useConfirmDeploy';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedWallet } from 'utils/selectors/user';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';
import { TokenStandards } from '../utils/token';
import { transferNFT } from '../utils/nft';
import { useAddHistory } from './useAddHistory';
import { Keys } from 'utils';
import { DeployStatus } from 'utils/constants/key';
import _get from 'lodash/get';
import { BigNumberish } from '@ethersproject/bignumber';
import { getContractPackageInfo } from 'services/ContractPackages/contractPackagesApis';

export enum ContractTypes {
  CEP78 = 'CEP78',
  CEP47 = 'CEP47',
}

type Params = {
  contractAddress: string;
  tokenId: string | number;
  toPublicKeyHex: string;
  tokenStandardId: TokenStandards;
  paymentAmount: BigNumberish;
  image?: string;
  name?: string;
  isUsingSessionCode?: boolean;
  wasmName?: string;
};

type Result = { deployHash: string; signedDeploy: any; contractHash: string };

export const useSendNFT = (options?: UseMutationOptions<unknown, unknown, Params>) => {
  const { executeDeploy, isDeploying } = useConfirmDeploy();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { addHistoryAsync, isLoading: isAddingHistory } = useAddHistory({
    onSuccess: async (_data, variable) => {
      await queryClient.invalidateQueries([Keys.deploysTransferNFT, variable.fromPublicKeyHex]);
    },
  });

  const selectedWallet = useSelector(getSelectedWallet);
  const showMessage = (message: string, type?: string) => {
    const messages = {
      message: message,
      type: type ?? MessageType.normal,
    };
    dispatch(allActions.main.showMessage(messages, type && type !== MessageType.normal ? 2000 : 30000));
  };

  const mutation = useMutation({
    ...options,
    mutationFn: async ({
      tokenStandardId,
      contractAddress,
      toPublicKeyHex,
      tokenId,
      paymentAmount,
      isUsingSessionCode,
      name,
      image,
      wasmName,
    }: Params): Promise<Result> => {
      const { contract_hash: contractHash } = await getContractPackageInfo(contractAddress);

      let buildDeployFn = () => {
        return transferNFT({
          tokenStandardId,
          contractHash,
          fromPublicKeyHex: selectedWallet.publicKey,
          toPublicKeyHex,
          tokenId,
          paymentAmount,
          isUsingSessionCode,
          wasmName,
        });
      };

      const { deployHash, signedDeploy } = await executeDeploy(buildDeployFn, showMessage);
      if (!deployHash) {
        throw new Error('Deploy hash is null');
      }

      await addHistoryAsync({
        fromPublicKeyHex: selectedWallet.publicKey,
        name,
        contractAddress,
        contractHash: contractHash,
        tokenId: tokenId.toString(),
        toPublicKeyHex,
        tokenStandardId,
        status: DeployStatus.pending,
        paymentAmount: paymentAmount.toString(),
        image,
        deployHash: deployHash,
        timestamp: _get(signedDeploy, 'deploy.header.timestamp'),
      });

      return { deployHash, signedDeploy, contractHash };
    },
    onSuccess: async (data, variable, context) => {
      options?.onSuccess?.(data, variable, context);
    },
  });

  return {
    ...mutation,
    isLoading: mutation.isLoading || isDeploying || isAddingHistory,
    send: mutation.mutate,
    sendAsync: mutation.mutateAsync,
  };
};
