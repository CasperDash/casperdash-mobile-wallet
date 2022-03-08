/* eslint-disable complexity */
import { createSelector } from 'reselect';

export const tokensSelector = state => state.home;

export const getMassagedTokenData = createSelector(
  tokensSelector,
  ({ tokenInfoWithBalance: data }) => {
    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(datum => {
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
                      ? parseFloat(datum.balance.hex / 10 ** decimals).toFixed(
                          2,
                        )
                      : 0,
                }
              : { displayValue: datum.balance || 0 },
          total_supply: {
            ...datum.total_supply,
            displayValue:
              datum.total_supply && datum.total_supply.hex
                ? parseInt(datum.total_supply.hex / 10 ** decimals)
                : 0,
          },
          decimals: {
            ...datum.decimals,
            displayValue:
              datum.decimals && datum.decimals.hex
                ? parseInt(datum.decimals.hex)
                : 0,
          },
        };
      } catch (error) {
        return {};
      }
    });
  },
);

export const getTokensAddressList = ({ main }) => {
  const tokensAddress = (main && main.tokensAddressList) || [];
  return [...new Set([...tokensAddress])];
};
