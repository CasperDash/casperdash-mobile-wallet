import { createSelector } from 'reselect';
import { convertBalanceFromHex } from 'utils/helpers/balance';
import { WalletInfo, User } from 'react-native-casper-storage';
import { WalletInfoDetails } from 'utils/helpers/account';

export const getListWallets = createSelector<any, any>(
  (state: any) => state.user,
  ({ currentAccount }: { currentAccount: User }) => {
    if (currentAccount) {
      const hdWalletInfo = currentAccount.getHDWallet()?.derivedWallets || [];
      const legacyWalletsInfo = currentAccount.getLegacyWallets() || [];

      return hdWalletInfo
        .map(
          (wl: WalletInfo): WalletInfoDetails => ({
            walletInfo: wl,
          }),
        )
        .concat(
          legacyWalletsInfo.map(
            (wl: WalletInfo): WalletInfoDetails => ({
              walletInfo: wl,
            }),
          ),
        );
    }
    return [];
  },
);

export const getSelectedWallet = createSelector(
  (state: any) => state.user,
  ({ selectedWallet }: { selectedWallet: WalletInfoDetails }) => selectedWallet,
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
export const getPublicKey = ({ user }: { user: any }) => {
  return user.casperdash && user.casperdash.publicKey;
};

const massageUserDetails = (userDetails: any) => {
  const hexBalance = userDetails && userDetails.balance ? userDetails.balance.hex : 0;
  return {
    ...userDetails,
    balance: {
      ...userDetails.balance,
      mote: parseInt(hexBalance),
      displayBalance: convertBalanceFromHex(hexBalance),
    },
  };
};

export const userDetailsSelector = (state: any) => state.user;

/* This is a selector that returns a function. The function takes in the state and returns the user
details. */
export const getMassagedUserDetails = createSelector(userDetailsSelector, (userDetails) => {
  return massageUserDetails(userDetails.info || {});
});
