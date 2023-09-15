import { UseMutationOptions, useMutation, useQueryClient } from 'react-query';

import { useConfirmDeploy } from 'utils/hooks/useConfirmDeploy';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedWallet } from 'utils/selectors/user';
import { CLPublicKey } from 'casperdash-js-sdk';
import { MessageType } from 'components/CMessge/types';
import { allActions } from 'redux_manager';
import { TokenStandards } from '../utils/token';
import { transferCEP47, transferCEP78 } from '../utils/nft';
import { useAddHistory } from './useAddHistory';
import { Keys } from 'utils';
import { DeployStatus } from 'utils/constants/key';
import { getContractPackageInfo } from 'services/ContractPackages/contractPackagesApis';
import { fetchWASM } from 'utils/helpers/request';
import _get from 'lodash/get';
import { BigNumberish } from '@ethersproject/bignumber';

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
  wasmUrl?: string;
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
      wasmUrl,
      name,
      image,
    }: Params): Promise<Result> => {
      let buildDeployFn;
      const clFromPublicKey = CLPublicKey.fromHex(selectedWallet.publicKey);
      const clToPublicKey = CLPublicKey.fromHex(toPublicKeyHex);
      showMessage('Please review the deploy');
      const { contract_hash: contractHash } = await getContractPackageInfo(contractAddress);

      switch (tokenStandardId) {
        case TokenStandards.CEP78:
          let wasm: Uint8Array | undefined;
          if (wasmUrl) {
            wasm = await fetchWASM(wasmUrl);
          }

          buildDeployFn = () => {
            return transferCEP78(
              {
                tokenId: tokenId.toString(),
                source: clFromPublicKey,
                target: clToPublicKey,
                contractHash: `hash-${contractHash}`,
              },
              {
                useSessionCode: !!isUsingSessionCode,
              },
              paymentAmount.toString(),
              clFromPublicKey,
              wasm,
            );
          };

          break;
        case TokenStandards.CEP47:
          buildDeployFn = () => {
            return transferCEP47(
              clToPublicKey,
              clFromPublicKey,
              [tokenId.toString()],
              `hash-${contractHash}`,
              paymentAmount.toString(),
              clFromPublicKey,
            );
          };

          break;
        default:
          throw new Error('Invalid contract type');
      }

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
