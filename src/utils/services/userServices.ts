import { CLPublicKey } from 'casperdash-js-sdk';
import { buildTransferDeploy } from './casperServices';
import { MOTE_RATE } from 'utils/constants/key';

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
    return buildTransferDeploy(fromPbKey, toPbKey, amount * MOTE_RATE, transferId, fee);
  } catch (error) {
    throw new Error('Failed to build transfer deploy.');
  }
};
