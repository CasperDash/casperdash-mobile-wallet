import { useSelector } from 'react-redux';
import { CONNECTION_TYPES } from '../constants/settings';
import { getLoginOptions, getSelectedWallet } from '../selectors/user';
import { signDeployByLedger } from '../services/ledgerServices';

/**
 * Use the signer specified in the login options to sign a deploy.
 * @returns The signed deploy is being returned.
 */
const useSigner = () => {
  const loginOptions = useSelector(getLoginOptions);
  const selectedWallet = useSelector(getSelectedWallet);
  /**
   * It signs the deploy with the main account.
   * @param deploy - The deploy object that you want to sign.
   * @param mainAccountHex - The public key of the account that will be used to sign the deploy.
   * @param setAccountHex - The hex of the account that will be used to sign the deploy.
   * @returns The `sign` function returns a `Promise` that resolves to a `Deploy` object.
   */
  const sign = async (deploy, mainAccountHex, setAccountHex) => {
    switch (loginOptions.connectionType) {
      case CONNECTION_TYPES.ledger: {
        return await signDeployByLedger(deploy, {
          publicKey: mainAccountHex,
          keyIndex: loginOptions.keyIndex,
        });
      }
      case CONNECTION_TYPES.passPhase: {
        console.log('selectedWallet', selectedWallet);
      }
      default:
        throw Error('Can not find signer');
    }
  };

  return { sign };
};

export default useSigner;
