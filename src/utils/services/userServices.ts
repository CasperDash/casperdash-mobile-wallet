import { CLPublicKey } from 'casperdash-js-sdk';
import { buildTransferDeploy } from './casperServices';
import { toMotes } from 'utils/helpers/currency';

/**
 * It builds a transfer deploy.
 * @param transactionDetail
 * @returns The transfer deploy.
 */
export const getTransferDeploy = (transactionDetail: any = {}) => {
  try {
    const { fromAddress, toAddress, amount, transferId = 0, fee } = transactionDetail;
    const fromPbKey = CLPublicKey.fromHex(fromAddress);
    const toPbKey = CLPublicKey.fromHex(toAddress);
    return buildTransferDeploy(fromPbKey, toPbKey, toMotes(amount), transferId, fee);
  } catch (error) {
    throw new Error('Failed to build transfer deploy.');
  }
};
