import { createSelector } from 'reselect';

const getCSPRMarketInfo = state => state.home;

export const getCurrentPrice = createSelector(
  getCSPRMarketInfo,
  ({ CSPRMarketInfo }) => {
    return CSPRMarketInfo && CSPRMarketInfo.length
      ? CSPRMarketInfo[0].current_price
      : 0;
  },
);
