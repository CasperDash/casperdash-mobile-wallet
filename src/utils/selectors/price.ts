import { createSelector } from 'reselect';

export const getCSPRMarketInfo = (state: any) => state.home;
const priceHistory = (state: any) => state.market;

/* This is a selector. Selectors are functions that return a value from a state. */
export const getCurrentPrice = createSelector(getCSPRMarketInfo, ({ CSPRMarketInfo }) => {
  return CSPRMarketInfo && CSPRMarketInfo.length ? CSPRMarketInfo[0].current_price : 0;
});

export const getPriceHistory = createSelector(priceHistory, ({ priceHistoryData: data }) => {
  return data
    ? data.prices.map((price: any) => ({
        x: price[0],
        y: parseFloat(parseFloat(price[1]).toFixed(4)),
      }))
    : [];
});
