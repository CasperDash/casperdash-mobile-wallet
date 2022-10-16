import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
  WalletInfo,
  CasperLegacyWallet,
} from 'react-native-casper-storage';
import { Keys } from 'casperdash-js-sdk';

import { Config, Keys as StorageKeys } from 'utils';

export interface WalletInfoDetails {
  walletInfo: WalletInfo;
  publicKey?: string;
  balance?: number;
}

/**
 * It generates a recovery phase for a given number of words
 * @param {number} numberOfWords - The number of words in the recovery phrase.
 * @returns A key manager instance
 */
export const getRecoveryPhase = (numberOfWords: number) => {
  const keyManager = KeyFactory.getInstance();
  return keyManager.generate(numberOfWords);
};

/**
 * It creates a new user with a password and a password validator that always returns true
 * @param {string} password - string - The password to use for the user.
 * @returns A new User object.
 */
export const createNewUser = (password: string): User => {
  const user = new User(password, {
    passwordValidator: {
      validatorFunc: () => new ValidationResult(true)
    }
  });

  return user;
};

/**
 * "Create a new user with a HD wallet."
 *
 * The first line of the function is the function declaration. It's a function that takes three
 * parameters:
 *
 * * password: string
 * * recoveryPhase: string
 * * encryptionType: EncryptionType
 *
 * The second line of the function is the function body. It's a function that returns a user
 * @param {string} password - The password you want to use to encrypt your wallet.
 * @param {string} recoveryPhase - This is the 12 word recovery phrase that you can use to recover your
 * wallet.
 * @param {EncryptionType} encryptionType - EncryptionType
 * @returns A new user with a HD wallet.
 */
export const createNewUserWithHdWallet = (
  password: string,
  recoveryPhase: string,
  encryptionType: EncryptionType,
) => {
  const user = createNewUser(password);
  user.setHDWallet(recoveryPhase, encryptionType);
  return user;
};

/**
 * It takes a user and a list of wallet info, and returns a list of wallet info with the public key
 * added to each wallet info
 * @param {User} user - User - this is the user object that you get from the login function
 * @param {WalletInfoDetails[]} WalletList - This is the list of wallets that you want to get the
 * public key for.
 * @returns An array of objects with the following properties:
 *   - walletInfo
 *   - walletInfoDetails
 *   - publicKey
 */
export const getWalletInfoWithPublicKey = async (
  user: User,
  WalletList: WalletInfoDetails[],
) => {
  return await Promise.all(
    WalletList.map(async walletInfo => {
      let publicKey;

      if (walletInfo.walletInfo.isHDWallet) {
        const wallet = await user.getWalletAccountByRefKey(
          walletInfo.walletInfo.id,
        );
        publicKey = await wallet.getPublicKey();
      } else if (walletInfo.walletInfo.isLegacy) {
        const wallet = new CasperLegacyWallet(
          walletInfo.walletInfo.id,
          walletInfo.walletInfo.encryptionType,
        );
        publicKey = await wallet.getPublicKey();
      }

      return { ...walletInfo, publicKey };
    }),
  );
};

/**
 * It takes a user and a wallet, and returns the public and private keys for that wallet
 * @param {User} user - User - the user object
 * @param {WalletInfoDetails} selectedWallet - WalletInfoDetails
 * @returns A key pair
 */
export const getWalletKeyPair = async (
  user: User,
  selectedWallet: WalletInfoDetails,
) => {
  let publicKey: Uint8Array;
  let privateKey: Uint8Array;
  const fullWalletInfo = user.getWalletInfo(selectedWallet.walletInfo.uid);
  if (fullWalletInfo.isHDWallet) {
    const wallet = await user.getWalletAccountByRefKey(fullWalletInfo.id);
    publicKey = await wallet.getPublicKeyByteArray();
    privateKey = wallet.getPrivateKeyByteArray();
  } else if (fullWalletInfo.isLegacy) {
    const wallet = new CasperLegacyWallet(
      fullWalletInfo.id,
      fullWalletInfo.encryptionType,
    );
    publicKey = await wallet.getPublicKeyByteArray();
    privateKey = wallet.getPrivateKeyByteArray();
  } else {
    throw Error('Error on get Keys');
  }

  // need to slice prefix
  const trimmedPublicKey = publicKey.slice(1);
  if (selectedWallet.walletInfo.encryptionType === EncryptionType.Ed25519) {
    return Keys.Ed25519.parseKeyPair(trimmedPublicKey, privateKey);
  } else {
    return Keys.Secp256K1.parseKeyPair(trimmedPublicKey, privateKey, 'raw');
  }
};

/**
 * It gets the user from storage, and returns it
 * @param {string} pin - The pin that the user entered
 * @returns The user object
 */
export const getUserFromStorage = async (
  pin: string,
): Promise<User | undefined> => {
  try {
    // @ts-ignore
    const casperdash = await Config.getItem(StorageKeys.casperdash);
    let currentAccount = null;
    if (casperdash && casperdash.loginOptions?.hashingOptions) {
      const hashingOptions = casperdash.loginOptions.hashingOptions;
      const saltData = hashingOptions.salt?.data || [];
      const salt = saltData && saltData.length > 0 ? new Uint8Array(saltData) : null;

      currentAccount = new User(pin, {
        passwordOptions: {
          passwordValidator: () => new ValidationResult(true),
          ...hashingOptions,
          salt: salt,
        },
      });
      await currentAccount.deserialize(casperdash?.userInfo);
      return currentAccount;
    }
  } catch (error) {
    return undefined;
  }
};
