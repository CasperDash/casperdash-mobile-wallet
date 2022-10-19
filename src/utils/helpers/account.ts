import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
  WalletInfo,
  CasperLegacyWallet,
  IPasswordOptions,
  PasswordOptions,
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
 * "Create a new user with the given password and password options."
 *
 * The first parameter is the password. The second parameter is optional. If it's not provided, the
 * default password options will be used
 * @param {string} password - string - The password to set for the user.
 * @param {IPasswordOptions} [passwordOptions] - IPasswordOptions - This is an optional parameter that
 * allows you to specify the password options.
 * @returns A new User object
 */
export const createNewUser = (
  password: string,
  passwordOptions?: IPasswordOptions,
): User => {
  const user = new User(password, {
    passwordValidator: {
      validatorFunc: () => new ValidationResult(true),
    },
    passwordOptions,
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
      const walletDetails = await getWalletDetails(user, walletInfo);
      publicKey = await walletDetails?.getPublicKey();

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
  //const fullWalletInfo = user.getWalletInfo(selectedWallet.walletInfo.uid);
  const walletDetails = await getWalletDetails(user, selectedWallet);
  if (walletDetails) {
    publicKey = await walletDetails.getPublicKeyByteArray();
    privateKey = walletDetails.getPrivateKeyByteArray();

    // need to slice prefix
    const trimmedPublicKey = publicKey.slice(1);
    if (selectedWallet.walletInfo.encryptionType === EncryptionType.Ed25519) {
      return Keys.Ed25519.parseKeyPair(trimmedPublicKey, privateKey);
    } else {
      return Keys.Secp256K1.parseKeyPair(trimmedPublicKey, privateKey, 'raw');
    }
  } else {
    throw Error('Error on get Keys');
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
    console.info('pin222', pin);
    // @ts-ignore
    const casperdash = await Config.getItem(StorageKeys.casperdash);
    let currentAccount = null;
    if (casperdash && casperdash.loginOptions?.hashingOptions) {
      const hashingOptions = casperdash.loginOptions.hashingOptions;
      const saltData = hashingOptions.salt?.data || [];
      const salt =
        saltData && saltData.length > 0 ? new Uint8Array(saltData) : null;
      currentAccount = createNewUser(pin, { ...hashingOptions, salt: salt });
      await currentAccount.deserialize(casperdash?.userInfo);
      return currentAccount;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * It takes a user object and a wallet object and returns a wallet object
 * @param {User} user - User - this is the user object that you get from the login function
 * @param {WalletInfoDetails} selectedWallet - WalletInfoDetails
 * @returns A wallet object
 */
export const getWalletDetails = async (
  user: User,
  selectedWallet: WalletInfoDetails,
) => {
  const fullWalletInfo = user.getWalletInfo(selectedWallet.walletInfo.uid);
  if (fullWalletInfo.isHDWallet) {
    const wallet = await user.getWalletAccountByRefKey(fullWalletInfo.id);
    return wallet;
  } else if (fullWalletInfo.isLegacy) {
    const wallet = new CasperLegacyWallet(
      fullWalletInfo.id,
      fullWalletInfo.encryptionType,
    );
    return wallet;
  }
};

/**
 * It creates a new instance of the PasswordOptions , and then saves it to storage
 * @param {string} pin - The pin that the user entered.
 */
export const createAndStoreMasterPassword = (pin: string) => {
  const masterPassword = new PasswordOptions(pin);
  Config.saveMasterPassword(masterPassword);
};

/**
 * It takes a pin, creates a new PasswordOptions object with the pin and the salt, iterations, and key
 * size from the master password, and then compares the password from the new PasswordOptions object to
 * the master password
 * @param {string} pin - The pin that the user entered
 * @returns The password is being returned.
 */
export const validatePin = async (pin: string, isBiometry?: boolean) => {
  let password;
  const masterPassword: PasswordOptions = await Config.getItem(
    StorageKeys.masterPassword,
  );
  if (isBiometry) {
    password = pin;
  } else {
    const checkingPassword = new PasswordOptions(pin, {
      salt: masterPassword.salt,
      iterations: masterPassword.iterations,
      keySize: masterPassword.keySize,
    });
    password = checkingPassword.password;
  }

  return masterPassword.password === password;
};
