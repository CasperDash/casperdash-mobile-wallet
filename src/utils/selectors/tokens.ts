/* eslint-disable complexity */
import { BigNumber } from '@ethersproject/bignumber';
import { ITokenInfo } from 'services/User/userApis';

export const tokensSelector = (state: any) => state.home;

/* A selector that returns an array of objects. */
export const getMassagedTokenData = (data: ITokenInfo[]): ITokenInfo[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map<ITokenInfo>((datum) => {
    const decimals = BigNumber.from(10).pow(datum?.decimals?.hex || 0);

    return {
      ...datum,
      balance: {
        ...datum.balance,
        displayValue: BigNumber.from(datum?.balance?.hex || 0)
          .div(decimals)
          .toNumber(),
      },
      total_supply: {
        ...datum.total_supply,
        displayValue:
          datum.total_supply && datum.total_supply.hex
            ? BigNumber.from(datum.total_supply.hex).div(decimals).toNumber()
            : 0,
      },
      decimals: {
        ...datum.decimals,
        displayValue: datum.decimals && datum.decimals.hex ? decimals.toNumber() : 0,
      },
    };
  });
};

/**
 * It returns a list of unique tokens addresses.
 * @returns An array of unique tokens addresses.
 */
export const getTokensAddressList = ({ main }: any) => {
  const tokensAddress = (main && main.tokensAddressList) || [];
  return [...new Set([...tokensAddress])];
};
