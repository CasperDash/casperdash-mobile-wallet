import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getMassagedTokenData, getMassagedUserDetails, getConfigurations, getPublicKey } from 'utils/selectors';
import { usePrice } from './usePrice';
import * as DEFAULT_CONFIG from '../constants/key';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import { useQuery } from 'react-query';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { ITokenInfo, getTokenInfoWithBalance } from 'services/User/userApis';

const CSPR_INFO = {
  symbol: 'CSPR',
  address: 'CSPR',
  icon: require('../../assets/images/ic_cspr.png'),
};

export const useTokenInfoWithBalance = (publicKey: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [ERequestKeys.tokenInfoWithBalance],
    queryFn: () => getTokenInfoWithBalance(publicKey),
    enabled: !!publicKey,
  });

  const massagedData = useMemo<ITokenInfo[]>(() => {
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

  const allTokenInfo = useMemo(() => {
    const transferFee = configurations.CSPR_TRANSFER_FEE || DEFAULT_CONFIG.CSPR_TRANSFER_FEE;
    const minAmount = configurations.MIN_CSPR_TRANSFER || DEFAULT_CONFIG.MIN_CSPR_TRANSFER;
    const tokenTransferFee = configurations.TOKEN_TRANSFER_FEE || DEFAULT_CONFIG.TOKEN_TRANSFER_FEE;

    const CSPRBalance = (accountDetails && accountDetails.balance && accountDetails.balance.displayBalance) || 0;
    const CSPRInfo = {
      ...CSPR_INFO,
      balance: { displayValue: CSPRBalance },
      price: CSPRPrice,
      totalPrice: CSPRPrice * CSPRBalance,
      transferFee: transferFee,
      minAmount: minAmount,
    };
    const tokenPrice = 0;
    const tokensInfo =
      tokensData && tokensData.length
        ? tokensData.map((datum) => ({
            price: tokenPrice,
            totalPrice: (datum.balance.displayValue || 0) * tokenPrice,
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
          return out + datum.totalPrice;
        }, 0)
      : 0;
  }, [allTokenInfo]);

  const getTokenInfoByAddress = useCallback(
    (token: any) => {
      return token && allTokenInfo && allTokenInfo.length
        ? allTokenInfo.find((info: any) => info.address === token.address)
        : {};
    },
    [allTokenInfo],
  );

  const refreshTokenInfo = useCallback(() => {
    refetchTokenData();
  }, []);

  return { allTokenInfo, accountTotalBalanceInFiat, getTokenInfoByAddress, refreshTokenInfo };
};
