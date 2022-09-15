import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
  WalletInfo,
  CasperLegacyWallet,
} from 'react-native-casper-storage';
import { Keys } from 'casperdash-js-sdk';

export interface WalletInfoDetails {
  walletInfo: WalletInfo;
  publicKey?: string;
  balance?: number;
}

export const getRecoveryPhase = (numberOfWords: number) => {
  const keyManager = KeyFactory.getInstance();
  return keyManager.generate(numberOfWords);
};

export const createNewUser = (password: string): User => {
  const user = new User(password, {
    passwordOptions: {
      passwordValidator: () => new ValidationResult(true),
    },
  });

  return user;
};

export const createNewUserWithHdWallet = (
  password: string,
  recoveryPhase: string,
  encryptionType: EncryptionType,
) => {
  const user = createNewUser(password);
  user.setHDWallet(recoveryPhase, encryptionType);
  return user;
};

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
