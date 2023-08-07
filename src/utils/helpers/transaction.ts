import memoizeOne from 'memoize-one';

import { IconStatusSend, IconStatusReceive, colors } from 'assets';

import { DeployStatus } from '../constants/key';

/**
 * Get transaction icon
 * @param {string} type
 */
export const getTransactionIcon = (type: string) => {
  switch (type) {
    case 'receive':
      return IconStatusReceive;

    default:
      return IconStatusSend;
  }
};

/**
 * enrich transaction with Icon
 */
export const enrichTransactionWithIcon = memoizeOne((transferList) => {
  return transferList.map((transfer: any) => {
    return { ...transfer, icon: getTransactionIcon(transfer.type) };
  });
});

export const StatusColorMapping: Record<DeployStatus, string> = {
  pending: colors.Y1,
  undelegating: colors.Y1,
  failed: colors.R1,
  completed: colors.G1,
};
