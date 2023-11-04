import { useSelector } from 'react-redux';
import { getSelectedWallet, getUser } from '../selectors/user';
import { signDeployByLedger } from '../services/ledgerServices';
import { getWalletKeyPair } from 'utils/helpers/account';
import { DeployUtil } from 'casperdash-js-sdk';
import * as Sentry from '@sentry/react-native';
/**
 * Use the signer specified in the login options to sign a deploy.
 * @returns The signed deploy is being returned.
 */
const useSigner = () => {
  const selectedWallet = useSelector(getSelectedWallet);
  const user = useSelector(getUser);
  /**
   * It signs the deploy with the main account.
   * @param deploy - The deploy object that you want to sign.
   * @param mainAccountHex - The public key of the account that will be used to sign the deploy.
   * @returns The `sign` function returns a `Promise` that resolves to a `Deploy` object.
   */
  const sign = async (deploy: DeployUtil.Deploy) => {
    try {
      const isLedger = selectedWallet.isLedger;
      if (isLedger) {
        return await signDeployByLedger(deploy, {
          publicKey: selectedWallet.publicKey,
          keyIndex: selectedWallet.ledgerKeyIndex,
          deviceId: selectedWallet.ledgerDeviceId,
        });
      }
      const { uid, encryptionType } = selectedWallet.walletInfo;
      const keyPair = await getWalletKeyPair(user, { uid, encryptionType });
      return DeployUtil.deployToJson(DeployUtil.signDeploy(deploy, keyPair));
    } catch (error: any) {
      console.error(error);
      Sentry.captureException(error);
      throw Error(`Error on signing deploy. \n ${error?.message}`);
    }
  };

  return { sign };
};

export default useSigner;
