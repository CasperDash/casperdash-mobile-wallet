import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
  WalletInfo,
  CasperLegacyWallet,
} from 'casper-storage';
import { Keys } from 'casperdash-js-sdk';
import { WalletType } from 'utils/constants/settings';

export interface WalletInfoDetails {
  walletType: WalletType;
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
      switch (walletInfo.walletType) {
        case WalletType.HDWallet: {
          const wallet = await user.getWalletAccountByRefKey(
            walletInfo.walletInfo.key,
          );
          publicKey = await wallet.getPublicKey();
          break;
        }
        case WalletType.LegacyWallet:
          const wallet = new CasperLegacyWallet(
            walletInfo.walletInfo.key,
            walletInfo.walletInfo.encryptionType,
          );
          publicKey = await wallet.getPublicKey();
          break;
        default:
          break;
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
  switch (selectedWallet.walletType) {
    case WalletType.HDWallet: {
      const wallet = await user.getWalletAccountByRefKey(
        selectedWallet.walletInfo.key,
      );
      publicKey = await wallet.getPublicKeyByteArray();
      privateKey = wallet.getPrivateKeyByteArray();

      break;
    }
    case WalletType.LegacyWallet:
      const wallet = new CasperLegacyWallet(
        selectedWallet.walletInfo.key,
        selectedWallet.walletInfo.encryptionType,
      );
      publicKey = await wallet.getPublicKeyByteArray();
      privateKey = wallet.getPrivateKeyByteArray();
      break;
    default:
      throw 'Error on get Keys';
  }
  // need to slice prefix
  const trimmedPublicKey = publicKey.slice(1);
  if (selectedWallet.walletInfo.encryptionType === EncryptionType.Ed25519) {
    return Keys.Ed25519.parseKeyPair(trimmedPublicKey, privateKey);
  } else {
    return Keys.Secp256K1.parseKeyPair(trimmedPublicKey, privateKey, 'raw');
  }
};
