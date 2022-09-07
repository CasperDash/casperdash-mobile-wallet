import {
  KeyFactory,
  User,
  ValidationResult,
  EncryptionType,
  WalletInfo,
  CasperLegacyWallet,
} from 'casper-storage';
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
