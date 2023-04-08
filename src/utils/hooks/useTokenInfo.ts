import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getMassagedTokenData, getMassagedUserDetails, getConfigurations } from 'utils/selectors';
import { usePrice } from './usePrice';
import * as DEFAULT_CONFIG from '../constants/key';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { useQuery } from 'react-query';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { ITokenInfoResponse, getTokenInfoWithBalance } from 'services/User/userApis';

export interface ITokenInfo extends ITokenInfoResponse {
  icon: string;
  price: number;
  totalValue: number;
  transferFee: number;
  minAmount?: number;
}

const CSPR_INFO = {
  symbol: 'CSPR',
  address: 'CSPR',
  icon: 'https://assets.casperdash.io/ic_cspr.png',
  name: 'Casper',
};

export const useTokenInfoWithBalance = (publicKey: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [ERequestKeys.tokenInfoWithBalance],
    queryFn: () => getTokenInfoWithBalance(publicKey),
    enabled: !!publicKey,
  });

  const massagedData = useMemo<ITokenInfoResponse[]>(() => {
    if (data) {
      const massagedTokenData = getMassagedTokenData(data);
      return massagedTokenData;
    }
    return [];
  }, [data]);

  return { data, massagedData, isLoading, refetch };
};

export const useTokenInfo = (publicKey: string) => {
  const accountDetails = useSelector(getMassagedUserDetails);
  const { massagedData: tokensData, refetch: refetchTokenData } = useTokenInfoWithBalance(publicKey);

  const configurations = useSelector(getConfigurations);

  const { currentPrice: CSPRPrice } = usePrice();

  const allTokenInfo = useMemo<ITokenInfo[]>(() => {
    const transferFee = configurations.CSPR_TRANSFER_FEE || DEFAULT_CONFIG.CSPR_TRANSFER_FEE;
    const minAmount = configurations.MIN_CSPR_TRANSFER || DEFAULT_CONFIG.MIN_CSPR_TRANSFER;
    const tokenTransferFee = configurations.TOKEN_TRANSFER_FEE || DEFAULT_CONFIG.TOKEN_TRANSFER_FEE;

    const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
    const CSPRInfo = {
      ...CSPR_INFO,
      balance: { displayValue: CSPRBalance },
      price: CSPRPrice,
      totalValue: CSPRPrice * CSPRBalance,
      transferFee: transferFee,
      minAmount: minAmount,
    };
    const tokenPrice = 0;
    const tokensInfo =
      tokensData && tokensData.length
        ? tokensData.map((datum) => ({
            price: tokenPrice,
            totalValue: (datum.balance.displayValue || 0) * tokenPrice,
            transferFee: tokenTransferFee,
            icon: getBase64IdentIcon(datum.address),
            ...datum,
          }))
        : [];

    return [CSPRInfo, ...tokensInfo];
  }, [accountDetails, CSPRPrice, tokensData, configurations]);

  const accountTotalBalanceInFiat = useMemo(() => {
    return allTokenInfo && allTokenInfo.length
      ? allTokenInfo.reduce((out: number, datum: any) => {
          return out + datum.totalValue;
        }, 0)
      : 0;
  }, [allTokenInfo]);

  const getTokenInfoByAddress = useCallback(
    (tokenAddress: string): ITokenInfo | undefined => {
      return tokenAddress && allTokenInfo && allTokenInfo.length
        ? allTokenInfo.find((info: ITokenInfo) => info.address === tokenAddress)
        : undefined;
    },
    [allTokenInfo],
  );

  const refreshTokenInfo = useCallback(() => {
    refetchTokenData();
  }, [refetchTokenData]);

  return { allTokenInfo, accountTotalBalanceInFiat, getTokenInfoByAddress, refreshTokenInfo };
};
