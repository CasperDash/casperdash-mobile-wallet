import memoizeOne from 'memoize-one';
import { IconStatusSend, IconStatusReceive } from 'assets';

/**
 * Get transaction icon
 * @param {string} type
 */
export const getTransactionIcon = type => {
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
export const enrichTransactionWithIcon = memoizeOne(transferList => {
  return transferList.map(transfer => {
    return { ...transfer, icon: getTransactionIcon(transfer.type) };
  });
});
