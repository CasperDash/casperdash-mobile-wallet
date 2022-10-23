import { MOTE_RATE } from '../constants/key';

/**
 * Convert mote balance from hex to display balance.
 * @param {String} balanceHex - Balance hex.
 * @return {Float} Balance in float.
 */
export const convertBalanceFromHex = (balanceHex: string) => {
  const balance = parseInt(balanceHex);
  return moteToCspr(balance);
};

/**
 * Convert a balance in CSPR to a balance in Mote.
 * @param {number} balanceInCSPR - The balance in CSPR that you want to convert to MOTE.
 * @returns The balance in CSPR is being converted to the balance in Mote.
 */
export const moteToCspr = (balanceInCSPR: number) => {
  return parseFloat((balanceInCSPR / MOTE_RATE).toString());
};
