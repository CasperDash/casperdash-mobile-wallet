import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '../constants/settings';
import { getLoginOptions, getUser } from '../selectors/user';
import { getWalletKeyPair } from 'utils/helpers/account';
import { encodeBase16, formatMessageWithHeaders, signFormattedMessage } from 'casperdash-js-sdk';
import { WalletInfo } from 'react-native-casper-storage';
import { UseMutationOptions, useMutation } from 'react-query';
import { signMessage } from 'utils/services/ledgerServices';

type Params = {
  message: string;
};

export const useSignMessage = (wallet?: WalletInfo, options?: UseMutationOptions<unknown, unknown, Params>) => {
  const loginOptions = useSelector(getLoginOptions);
  const user = useSelector(getUser);

  const mutation = useMutation({
    ...options,
    mutationFn: async ({ message }: Params) => {
      try {
        if (loginOptions.connectionType === CONNECTION_TYPES.ledger) {
          return signMessage(message, {
            keyIndex: loginOptions.keyIndex,
          });
        } else {
          if (!wallet) {
            throw Error('Wallet is not defined');
          }
          let messageBytes;
          try {
            messageBytes = formatMessageWithHeaders(message);
          } catch (err) {
            throw new Error('Could not format message: ' + err);
          }

          const keyPair = await getWalletKeyPair(user, wallet);
          if (!keyPair) {
            throw new Error('Can not generate key pair');
          }

          const result = signFormattedMessage(keyPair, messageBytes);

          return encodeBase16(result);
        }
      } catch (error: any) {
        console.error(error);
        throw Error(`Error on signing message. \n ${error?.message}`);
      }
    },
  });

  return {
    ...mutation,
    signMessage: mutation.mutate,
    signMessageAsync: mutation.mutateAsync,
  };
};
