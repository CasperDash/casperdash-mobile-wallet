import { CLPublicKey } from 'casperdash-js-sdk';

import { buildTransferTokenDeploy } from './casperServices';

/**
 * It builds a transfer token deploy.
 * @param [transactionDetail] - {
 * @returns The transaction object.
 */
export const getTransferTokenDeploy = (transactionDetail: any = {}) => {
  try {
    const { fromAddress, toAddress, amount, contractInfo = {}, fee } = transactionDetail;
    const { address, decimals } = contractInfo;
    const fromPbKey = CLPublicKey.fromHex(fromAddress);
    const toPbKey = CLPublicKey.fromHex(toAddress);
    return buildTransferTokenDeploy(fromPbKey, toPbKey, amount * 10 ** decimals.hex, address, fee);
  } catch (error) {
    throw new Error('Failed to get token transfer deploy.');
  }
};
