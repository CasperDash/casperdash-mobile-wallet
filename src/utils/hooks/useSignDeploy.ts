import * as Sentry from '@sentry/react-native';
import { DeployUtil } from 'casperdash-js-sdk';
import { WalletInfo } from 'react-native-casper-storage';
import { UseMutationOptions, useMutation } from 'react-query';
import { useSelector } from 'react-redux';
import { JsonTypes } from 'typedjson';

import { getWalletKeyPair } from 'utils/helpers/account';

import { CONNECTION_TYPES } from '../constants/settings';
import { getLoginOptions, getUser } from '../selectors/user';
import { signDeployByLedger } from '../services/ledgerServices';

type Params = {
  deploy: DeployUtil.Deploy;
  mainAccountHex: string;
};

export const useSignDeploy = (wallet?: WalletInfo, options?: UseMutationOptions<unknown, unknown, Params>) => {
  const loginOptions = useSelector(getLoginOptions);
  const user = useSelector(getUser);

  const mutation = useMutation({
    ...options,
    mutationFn: async ({ deploy, mainAccountHex }: Params): Promise<{ deploy: JsonTypes }> => {
      try {
        if (loginOptions.connectionType === CONNECTION_TYPES.ledger) {
          return await signDeployByLedger(deploy, {
            publicKey: mainAccountHex,
            keyIndex: wallet?.uid,
          });
        } else {
          if (!wallet) {
            throw Error('Wallet is not defined');
          }

          const keyPair = await getWalletKeyPair(user, wallet);
          return DeployUtil.deployToJson(DeployUtil.signDeploy(deploy, keyPair));
        }
      } catch (error: any) {
        console.error(error);
        Sentry.captureException(error);

        throw Error(`Error on signing deploy. \n ${error?.message}`);
      }
    },
  });

  return {
    ...mutation,
    sign: mutation.mutate,
    signAsync: mutation.mutateAsync,
  };
};
