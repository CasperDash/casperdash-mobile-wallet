import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '../constants/settings';
import { getLoginOptions, getUser } from '../selectors/user';
import { signDeployByLedger } from '../services/ledgerServices';
import { getWalletKeyPairByWallet } from 'utils/helpers/account';
import { DeployUtil, encodeBase16, formatMessageWithHeaders, signFormattedMessage } from 'casperdash-js-sdk';
import * as Sentry from '@sentry/react-native';
import { WalletInfo } from 'react-native-casper-storage';
/**
 * Use the signer specified in the login options to sign a deploy.
 * @returns The signed deploy is being returned.
 */
export const useSignerWithWallet = (wallet?: WalletInfo) => {
  const loginOptions = useSelector(getLoginOptions);
  const user = useSelector(getUser);
  /**
   * It signs the deploy with the main account.
   * @param deploy - The deploy object that you want to sign.
   * @param mainAccountHex - The public key of the account that will be used to sign the deploy.
   * @returns The `sign` function returns a `Promise` that resolves to a `Deploy` object.
   */
  const sign = async (deploy: DeployUtil.Deploy, mainAccountHex: string) => {
    if (!wallet) {
      throw Error('Wallet is not defined');
    }

    try {
      switch (loginOptions.connectionType) {
        case CONNECTION_TYPES.ledger: {
          return await signDeployByLedger(deploy, {
            publicKey: mainAccountHex,
            keyIndex: loginOptions.keyIndex,
          });
        }
        default: {
          const keyPair = await getWalletKeyPairByWallet(user, wallet);
          return DeployUtil.deployToJson(DeployUtil.signDeploy(deploy, keyPair));
        }
      }
    } catch (error: any) {
      console.error(error);
      Sentry.captureException(error);
      throw Error(`Error on signing deploy. \n ${error?.message}`);
    }
  };

  const signMessage = async (message: string) => {
    if (!wallet) {
      throw Error('Wallet is not defined');
    }

    try {
      switch (loginOptions.connectionType) {
        case CONNECTION_TYPES.ledger: {
          // TODO: Implement signMessageByLedger
          break;
        }
        default: {
          let messageBytes;
          try {
            messageBytes = formatMessageWithHeaders(message);
          } catch (err) {
            throw new Error('Could not format message: ' + err);
          }

          const keyPair = await getWalletKeyPairByWallet(user, wallet);
          if (!keyPair) {
            throw new Error('Can not generate key pair');
          }

          const result = signFormattedMessage(keyPair, messageBytes);

          return encodeBase16(result);
        }
      }
    } catch (error: any) {
      console.error(error);
      throw Error(`Error on signing message. \n ${error?.message}`);
    }
  };

  return { sign, signMessage };
};
