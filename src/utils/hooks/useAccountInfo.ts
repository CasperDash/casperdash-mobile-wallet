import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { getAccountInfo } from 'services/User/userApis';
import { IAccountResponse, IDisplayCSPRBalance } from 'services/User/userTypes';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { toCSPR } from 'utils/helpers/currency';

export const massageUserDetails = (userDetails: IAccountResponse): IAccountInfo => {
  const hexBalance = userDetails?.balance?.hex ?? 0;
  return {
    ...userDetails,
    balance: {
      ...userDetails.balance,
      displayBalance: toCSPR(hexBalance),
    },
  };
};

export interface IAccountInfo extends IAccountResponse {
  balance: IDisplayCSPRBalance;
}

export const useAccountInfo = (publicKey: string) => {
  const query = useQuery({
    queryKey: [ERequestKeys.accountInfo],
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
