import { useCallback, useMemo } from 'react';
import { getMassagedTokenData } from 'utils/selectors';
import { usePrice } from './usePrice';
import * as DEFAULT_CONFIG from '../constants/key';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { UseQueryOptions, useQuery } from 'react-query';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { ITokenInfoResponse } from 'services/User/userTypes';
import { getTokenInfoWithBalance } from 'services/User/userApis';
import { useAccountInfo } from './useAccountInfo';
import { useConfigurations } from './useConfigurations';
import { getTokenInfo } from 'services/Token/tokenApis';

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
  const query = useQuery({
    queryKey: [ERequestKeys.tokenInfoWithBalance, publicKey],
    queryFn: () => getTokenInfoWithBalance(publicKey),
    enabled: !!publicKey,
  });

  const massagedData = useMemo<ITokenInfoResponse[]>(() => {
    if (query.data) {
      const massagedTokenData = getMassagedTokenData(query.data);
      return massagedTokenData;
    }
    return [];
  }, [query.data]);

  return { ...query, massagedData };
};

export const useTokenInfoByPublicKey = (publicKey: string) => {
  const {
    massagedData: tokensData,
    refetch: refetchTokenData,
    isLoading: isLoadingToken,
    isFetching: isFetchingToken,
    isError: isTokenError,
  } = useTokenInfoWithBalance(publicKey);
  const {
    massagedData: accountDetails,
    refetch: refetchAccountInfo,
    isLoading: isLoadingAccountInfo,
    isFetching: isFetchingAccountInfo,
    isError: isAccountError,
  } = useAccountInfo(publicKey);

  const { data: configurations } = useConfigurations();

  const { currentPrice: CSPRPrice, refetch: refetchPrice } = usePrice();

  const allTokenInfo = useMemo<ITokenInfo[]>(() => {
    const transferFee = configurations?.CSPR_TRANSFER_FEE || DEFAULT_CONFIG.CSPR_TRANSFER_FEE;
    const minAmount = configurations?.MIN_CSPR_TRANSFER || DEFAULT_CONFIG.MIN_CSPR_TRANSFER;
    const tokenTransferFee = configurations?.TOKEN_TRANSFER_FEE || DEFAULT_CONFIG.TOKEN_TRANSFER_FEE;

    const CSPRBalance = accountDetails?.balance?.displayBalance ?? 0;

    const CSPRInfo = {
      ...CSPR_INFO,
      balance: { displayValue: CSPRBalance },
      price: CSPRPrice,
      totalValue: CSPRBalance * CSPRPrice,
      transferFee: transferFee,
      minAmount: minAmount,
    };
    const tokenPrice = 0;
    const tokensInfo = tokensData?.length
      ? tokensData.map((datum) => {
          return {
            ...datum,
            price: tokenPrice,
            totalValue: (datum?.balance?.displayValue || 0) * tokenPrice,
            transferFee: tokenTransferFee,
            icon: datum.icon || getBase64IdentIcon(datum.address),
          };
        })
      : [];

    return [CSPRInfo, ...tokensInfo];
  }, [accountDetails, CSPRPrice, tokensData, configurations]);

  const accountTotalBalanceInFiat = useMemo(() => {
    return allTokenInfo?.length
      ? allTokenInfo.reduce((out: number, datum: ITokenInfo) => {
          return out + datum.totalValue;
        }, 0)
      : 0;
  }, [allTokenInfo]);

  const getTokenInfoByAddress = useCallback(
    (tokenAddress: string): ITokenInfo | undefined => {
      return tokenAddress && allTokenInfo?.length
        ? allTokenInfo.find((info: ITokenInfo) => info.address === tokenAddress)
        : undefined;
    },
    [allTokenInfo],
  );

  const refreshTokenInfo = useCallback(() => {
    refetchTokenData();
    refetchAccountInfo();
    refetchPrice();
  }, [refetchTokenData, refetchPrice, refetchAccountInfo]);

  return {
    allTokenInfo,
    accountTotalBalanceInFiat,
    getTokenInfoByAddress,
    refreshTokenInfo,
    isLoading: isLoadingAccountInfo || isLoadingToken,
    isFetching: isFetchingAccountInfo || isFetchingToken,
    isError: isAccountError || isTokenError,
  };
};

export const useTokenInfo = (
  tokenAddress: string,
  options: Omit<
    UseQueryOptions<unknown, any, Omit<ITokenInfoResponse, 'balance'>, [ERequestKeys.tokenInfo, string | undefined]>,
    'queryKey' | 'queryFn'
  >,
) => {
  const query = useQuery({
    queryKey: [ERequestKeys.tokenInfo, tokenAddress],
    queryFn: () => getTokenInfo(tokenAddress),
    ...options,
  });
  return query;
};
