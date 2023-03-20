/* eslint-disable complexity */
import { createSelector } from 'reselect';

export const tokensSelector = (state: any) => state.home;

/* A selector that returns an array of objects. */
export const getMassagedTokenData = createSelector(tokensSelector, ({ tokenInfoWithBalance: data }) => {
  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((datum) => {
    try {
      const decimals = (datum.decimals && datum.decimals.hex) || 0;

      return {
        ...datum,
        balance:
          typeof datum.balance === 'object'
            ? {
                ...datum.balance,
                displayValue:
                  datum.balance && datum.balance.hex
                    ? parseFloat((datum.balance.hex / 10 ** decimals).toString()).toFixed(2)
                    : 0,
              }
            : { displayValue: datum.balance || 0 },
        total_supply: {
          ...datum.total_supply,
          displayValue:
            datum.total_supply && datum.total_supply.hex
              ? // eslint-disable-next-line radix
                parseInt((datum.total_supply.hex / 10 ** decimals).toString())
              : 0,
        },
        decimals: {
          ...datum.decimals,
          displayValue:
            datum.decimals && datum.decimals.hex
              ? // eslint-disable-next-line radix
                parseInt(datum.decimals.hex)
              : 0,
        },
      };
    } catch (error) {
      return {};
    }
  });
});

/**
 * It returns a list of unique tokens addresses.
 * @returns An array of unique tokens addresses.
 */
export const getTokensAddressList = ({ main }: any) => {
  const tokensAddress = (main && main.tokensAddressList) || [];
  return [...new Set([...tokensAddress])];
};
