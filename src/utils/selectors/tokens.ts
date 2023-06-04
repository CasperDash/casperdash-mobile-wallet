import { BigNumber } from '@ethersproject/bignumber';
import { ITokenInfoResponse } from 'services/User/userTypes';
import Big from 'big.js';

export const tokensSelector = (state: any) => state.home;

/* A selector that returns an array of objects. */
export const getMassagedTokenData = (data: ITokenInfoResponse[]): ITokenInfoResponse[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map<ITokenInfoResponse>((datum) => {
    const decimals = new Big(
      BigNumber.from(10)
        .pow(datum?.decimals?.hex ?? 0)
        .toNumber(),
    );

    return {
      ...datum,
      balance: {
        ...datum.balance,
        displayValue: new Big(BigNumber.from(datum?.balance?.hex ?? 0).toNumber()).div(decimals).toNumber(),
      },
      total_supply: {
        ...datum.total_supply,
        displayValue: datum.total_supply?.hex
          ? new Big(BigNumber.from(datum.total_supply.hex).toNumber()).div(decimals).toNumber()
          : 0,
      },
      decimals: {
        ...datum.decimals,
        displayValue: datum.decimals?.hex ? BigNumber.from(datum.decimals.hex).toNumber() : 0,
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
