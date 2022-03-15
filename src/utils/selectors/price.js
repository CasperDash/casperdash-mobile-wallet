import { createSelector } from 'reselect';

const getCSPRMarketInfo = state => state.home;

/* This is a selector. Selectors are functions that return a value from a state. */
export const getCurrentPrice = createSelector(
  getCSPRMarketInfo,
  ({ CSPRMarketInfo }) => {
    return CSPRMarketInfo && CSPRMarketInfo.length
      ? CSPRMarketInfo[0].current_price
      : 0;
  },
);
