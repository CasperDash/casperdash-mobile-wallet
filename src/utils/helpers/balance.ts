import { MOTE_RATE } from '../constants/key';

/**
 * Convert mote balance from hex to display balance.
 * @param {String} balanceHex - Balance hex.
 * @return {Float} Balance in float.
 */
export const convertBalanceFromHex = (balanceHex: string) => {
  const balance = parseInt(balanceHex, 10);
  return moteToCspr(balance);
};

export const moteToCspr = (balanceInCSPR: number) => {
  return parseFloat((balanceInCSPR / MOTE_RATE).toString());
};
