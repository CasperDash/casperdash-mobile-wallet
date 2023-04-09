import { BigNumber } from '@ethersproject/bignumber';
import { MOTE_RATE } from '../constants/key';

/**
 * Convert CSPR to motes
 * @param {Number|String} amount
 * @returns {BigNumberis|String} Return 0 if it's the invalid big number input.
 * @example
 * toMotes(1) // 1000000000
 * toMotes(0.1) // 100000000
 * toMotes(0.01) // 10000000
 * toMotes(0.001) // 1000000
 * toMotes(0.0001) // 100000
 **/
export const toMotes = (amount: number | string): BigNumber => {
  try {
    const bigAmount = BigNumber.from(amount).mul(MOTE_RATE);
    return bigAmount;
  } catch (error) {
    return BigNumber.from(0);
  }
};

/**
 * Convert motes to CSPR
 * @param {Number|String} amount
 * @returns {BigNumberis|String} Return 0 if it's the invalid big number input.
 * @example
 * toCSPR(1000000000) // 1
 */
export const toCSPR = (amount: number | string): BigNumber => {
  try {
    const bigAmount = BigNumber.from(amount).div(MOTE_RATE);
    return bigAmount;
  } catch (error) {
    return BigNumber.from(0);
  }
};
