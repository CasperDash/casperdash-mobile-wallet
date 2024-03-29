import { createSelector } from 'reselect';
import { WalletInfo, User } from 'react-native-casper-storage';
import { WalletInfoDetails } from 'utils/helpers/account';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';

export const getListWallets = createSelector<any, IAccountInfo[]>(
  (state: any) => state.user,
  ({ currentAccount }: { currentAccount: User }) => {
    if (currentAccount) {
      const hdWalletInfo = currentAccount.getHDWallet()?.derivedWallets || [];
      const legacyWalletsInfo = currentAccount.getLegacyWallets() || [];

      return hdWalletInfo
        .map(
          (wl: WalletInfo): IAccountInfo => ({
            walletInfo: wl,
            publicKey: '',
          }),
        )
        .concat(
          legacyWalletsInfo.map(
            (wl: WalletInfo): IAccountInfo => ({
              walletInfo: wl,
              publicKey: '',
            }),
          ),
        );
    }
    return [];
  },
);

export const getSelectedWallet = createSelector(
  (state: any) => state.user,
  ({ selectedWallet }: { selectedWallet: IAccountInfo }) => selectedWallet,
);

export const getUser = createSelector(
  (state: any) => state.user,
  ({ currentAccount }) => currentAccount,
);

/**
 * It returns the login options for the user
 * @returns The login options for the user.
 */
export const getLoginOptions = ({ user }: { user: any }) => {
  return (user.casperdash && user.casperdash.loginOptions) || {};
};

/**
 * Given a user object, return the user's public key
 * @returns The public key of the user.
 */
export const getPublicKey = createSelector(
  (state: any) => state.user,
  ({ selectedWallet, casperdash }: { selectedWallet: WalletInfoDetails; casperdash: { publicKey: string } }) =>
    selectedWallet?.publicKey ?? casperdash?.publicKey ?? '',
);

export const userDetailsSelector = (state: any) => state.user;
