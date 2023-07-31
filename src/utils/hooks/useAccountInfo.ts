import { useMemo } from 'react';
import { WalletInfo } from 'react-native-casper-storage';
import { UseQueryOptions, useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { getAccountInfo, getListAccountInfo } from 'services/User/userApis';
import { IAccountResponse, IDisplayCSPRBalance } from 'services/User/userTypes';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { getWalletInfoWithPublicKey } from 'utils/helpers/account';
import { toCSPRFromHex } from 'utils/helpers/currency';
import { getListWallets, getPublicKey, getUser } from 'utils/selectors/user';

export const massageUserDetails = (userDetails: IAccountResponse): IAccountInfo => {
  const hexBalance = userDetails?.balance?.hex ?? 0;
  return {
    ...userDetails,
    balance: {
      ...userDetails.balance,
      displayBalance: toCSPRFromHex(hexBalance).toNumber(),
    },
  };
};

export interface IAccountInfo extends IAccountResponse {
  balance?: IDisplayCSPRBalance;
}

export type AccountInfo = {
  publicKey?: string;
  walletInfo: WalletInfo;
};

export const useAccountInfo = (publicKey: string) => {
  const query = useQuery({
    queryKey: [ERequestKeys.accountInfo, publicKey],
    queryFn: () => getAccountInfo(publicKey),
    enabled: !!publicKey,
  });

  const massagedData = useMemo(() => {
    if (query.data) {
      return massageUserDetails(query.data);
    }
    return undefined;
  }, [query.data]);

  return { ...query, massagedData };
};

export const useListAccountInfo = (
  publicKeys: string[],
  options?: Omit<UseQueryOptions<unknown, any, IAccountResponse[], any>, 'queryKey' | 'queryFn'>,
) => {
  const { enabled, ...rest } = options || {};
  const query = useQuery({
    queryKey: [ERequestKeys.listAccountInfo, publicKeys],
    queryFn: () => getListAccountInfo(publicKeys),
    enabled: !!publicKeys && publicKeys.length > 0 && enabled,
    ...rest,
  });

  const massagedData = useMemo(() => {
    if (query.data) {
      return query.data.map((userDetails: IAccountResponse) => massageUserDetails(userDetails));
    }
    return [];
  }, [query.data]);

  return { ...query, massagedData };
};

export const useMyAccounts = (
  options?: Omit<UseQueryOptions<AccountInfo[], any, AccountInfo[], any>, 'queryKey' | 'queryFn'>,
) => {
  const user = useSelector(getUser);
  const publicKey = useSelector(getPublicKey);
  const listWallets = useSelector(getListWallets);
  const uids = listWallets
    .filter((item: { walletInfo: WalletInfo }) => item.walletInfo.uid)
    .map((item: { walletInfo: WalletInfo }) => item.walletInfo.uid);

  return useQuery({
    queryKey: [
      ERequestKeys.myAccounts,
      publicKey,
      {
        uids,
      },
    ],
    queryFn: async () => {
      const wallets: AccountInfo[] = await getWalletInfoWithPublicKey(user, listWallets);

      return wallets;
    },
    ...options,
    enabled: !!publicKey,
  });
};
