import { BigNumber } from '@ethersproject/bignumber';
import { ITokenInfoResponse } from 'services/User/userTypes';
import Big from 'big.js';
import { toBigFromDecimalHex } from "utils/helpers/currency";

export const tokensSelector = (state: any) => state.home;

/* A selector that returns an array of objects. */
export const getMassagedTokenData = (data: ITokenInfoResponse[]): ITokenInfoResponse[] => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map<ITokenInfoResponse>((datum) => {
    const decimals = toBigFromDecimalHex(10, datum?.decimals?.hex ?? 0);
    const isNotZero = !decimals.eq(0);

    return {
      ...datum,
      balance: {
        ...datum.balance,
        displayValue: isNotZero
          ? new Big(BigNumber.from(datum?.balance?.hex ?? 0).toString()).div(decimals).toNumber()
          : 0,
      },
      total_supply: {
        ...datum.total_supply,
        displayValue:
          datum.total_supply?.hex && isNotZero
            ? new Big(BigNumber.from(datum.total_supply.hex).toString()).div(decimals).toNumber()
            : 0,
      },
      decimals: {
        ...datum.decimals,
        displayValue: isNotZero && datum.decimals?.hex ? BigNumber.from(datum.decimals.hex).toNumber() : 0,
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
