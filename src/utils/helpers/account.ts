import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
  WalletInfo,
  CasperLegacyWallet,
  PasswordOptions,
} from 'react-native-casper-storage';
import { Keys } from 'casperdash-js-sdk';

import { Config, Keys as StorageKeys } from 'utils';
import { CONNECTION_TYPES } from 'utils/constants/settings';

export interface WalletInfoDetails {
  walletInfo: WalletInfo;
  publicKey?: string;
}

export interface CasperDashStoredInfo {
  publicKey: string;
  loginOptions: {
    connectionType: CONNECTION_TYPES;
  };
  userInfo: string;
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
 * @returns A new User object
 */
export const createNewUser = (password: string, derivationPath?: string): User => {
  const user = new User(
    password,
    {
      passwordValidator: {
        validatorFunc: () => new ValidationResult(true),
      },
    },
    derivationPath,
  );

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
 * @param {string} recoveryPhase - This is the 12 or 24 words recovery phrase that you can use to recover your
 * wallet.
 * @param {EncryptionType} encryptionType - EncryptionType
 * @returns A new user with a HD wallet.
 */
export const createNewUserWithHdWallet = async (
  password: string,
  recoveryPhase: string,
  encryptionType: EncryptionType,
  derivationPath?: string,
) => {
  const user = createNewUser(password, derivationPath);
  await user.setHDWallet(recoveryPhase, encryptionType);
  return user;
};

/**
 * It gets the public key cache from the local storage and returns the public key for the given uid
 * @param {string} uid - The user ID of the user you want to get the public key for.
 * @returns The public key for the user with the given uid.
 */
export const getPublicKeyCache = async (uid: string): Promise<string> => {
  const publicKeysCache = await Config.getItem(StorageKeys.publicKeysCache);

  return publicKeysCache && publicKeysCache[uid];
};

/**
 * It takes a user ID and a public key, and saves the public key in the cache
 * @param {string} uid - The user ID of the user you want to encrypt the message for.
 * @param {string} publicKey - The public key of the user you want to encrypt the message for.
 */
export const cachePublicKey = async (uid: string, publicKey: string) => {
  const publicKeysCache = await Config.getItem(StorageKeys.publicKeysCache);
  Config.saveItem(StorageKeys.publicKeysCache, {
    ...publicKeysCache,
    [uid]: publicKey,
  });
};

/**
 * It takes a user object, serializes it, and then stores it in the local storage
 * @param {User} user - User - The user object that you want to serialize and store.
 */
export const serializeAndStoreUser = async (user: User, options?: Partial<CasperDashStoredInfo>) => {
  const userInfo = await user.serialize();
  const casperDashInfo = await Config.getItem(StorageKeys.casperdash);

  await Config.saveItem(StorageKeys.casperdash, {
    ...casperDashInfo,
    ...options,
    userInfo,
  });
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
export const getWalletInfoWithPublicKey = async (user: User, walletList: WalletInfoDetails[]) => {
  return await Promise.all(
    walletList.map(async (walletInfo) => {
      let publicKey;
      publicKey = await getPublicKeyCache(walletInfo.walletInfo.uid);
      if (!publicKey) {
        const walletDetails = await getWalletDetails(user, walletInfo);
        publicKey = await walletDetails?.getPublicKey();
        if (publicKey) {
          await cachePublicKey(walletInfo.walletInfo.uid, publicKey);
        }
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
export const getWalletKeyPair = async (user: User, selectedWallet: WalletInfoDetails) => {
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
 * It takes a user and a wallet, and returns the public and private keys for that wallet
 * @param {User} user - User - the user object
 * @param {WalletInfoDetails} selectedWallet - WalletInfoDetails
 * @returns A key pair
 */
export const getWalletKeyPairByWallet = async (
  user: User,
  { uid, encryptionType }: Pick<WalletInfo, 'uid' | 'encryptionType'>,
) => {
  let publicKey: Uint8Array;
  let privateKey: Uint8Array;
  //const fullWalletInfo = user.getWalletInfo(selectedWallet.walletInfo.uid);
  const walletDetails = await getWalletDetailsByUid(user, uid);
  if (walletDetails) {
    publicKey = await walletDetails.getPublicKeyByteArray();
    privateKey = walletDetails.getPrivateKeyByteArray();

    // need to slice prefix
    const trimmedPublicKey = publicKey.slice(1);
    if (encryptionType === EncryptionType.Ed25519) {
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
export const getUserFromStorage = async (pin: string): Promise<User | undefined> => {
  try {
    // @ts-ignore
    const casperdash = await Config.getItem(StorageKeys.casperdash);
    let currentAccount = null;
    if (casperdash && casperdash.userInfo) {
      currentAccount = createNewUser(pin);
      await currentAccount.deserialize(casperdash.userInfo);
      return currentAccount;
    }
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * TODO: Refactor later with getWalletDetailsByUid
 * It takes a user object and a wallet object and returns a wallet object
 * @param {User} user - User - this is the user object that you get from the login function
 * @param {WalletInfoDetails} selectedWallet - WalletInfoDetails
 * @returns A wallet object
 */
export const getWalletDetails = async (user: User, selectedWallet: WalletInfoDetails) => {
  const uid = selectedWallet.walletInfo.uid;
  const fullWalletInfo = user.getWalletInfo(uid);
  if (fullWalletInfo.isHDWallet) {
    const index = fullWalletInfo.index;
    const wallet = await user.getWalletAccount(index);
    return wallet;
  } else if (fullWalletInfo.isLegacy) {
    const wallet = new CasperLegacyWallet(fullWalletInfo.id, fullWalletInfo.encryptionType);
    return wallet;
  }
};

export const getWalletDetailsByUid = async (user: User, uid: string) => {
  const fullWalletInfo = user.getWalletInfo(uid);
  if (fullWalletInfo.isHDWallet) {
    const { index } = fullWalletInfo;
    const wallet = await user.getWalletAccount(index);

    return wallet;
  } else if (fullWalletInfo.isLegacy) {
    const wallet = new CasperLegacyWallet(fullWalletInfo.id, fullWalletInfo.encryptionType);

    return wallet;
  }
};

/**
 * It creates a new instance of the PasswordOptions , and then saves it to storage
 * @param {string} pin - The pin that the user entered.
 */
export const createAndStoreMasterPassword = async (pin: string) => {
  const masterPassword = new PasswordOptions(pin);
  await Config.saveItem(StorageKeys.masterPassword, masterPassword.password);
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
  const masterPassword: string = await Config.getItem(StorageKeys.masterPassword);
  if (isBiometry) {
    password = pin;
  } else {
    const checkingPassword = new PasswordOptions(pin);
    password = checkingPassword.password;
  }

  return masterPassword === password;
};

/**
 * It saves the public key and wallet info to the device's storage
 * @param {WalletInfo} walletInfo - WalletInfo,
 * @param {string} publicKey - The public key of the wallet you want to set as the selected wallet.
 * @returns The selected wallet
 */
export const setSelectedWallet = async (walletInfo: WalletInfo, publicKey: string) => {
  const casperDashInfo = await Config.getItem(StorageKeys.casperdash);
  casperDashInfo.publicKey = publicKey;
  await Config.saveItem(StorageKeys.casperdash, casperDashInfo);

  const selectedWallet = {
    publicKey,
    walletInfo: {
      descriptor: walletInfo.descriptor,
      encryptionType: walletInfo.encryptionType,
      uid: walletInfo.uid,
    },
  };
  await Config.saveItem(StorageKeys.selectedWallet, selectedWallet);
  return selectedWallet;
};
