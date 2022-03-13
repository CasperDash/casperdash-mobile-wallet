import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDeploysTransfer,
  updateTransferDeployStatus,
} from 'utils/selectors/transfer';
import { apis } from 'services';
import { Keys } from 'utils';
import { allActions } from 'redux_manager';

/**
 * Sort the array by the timestamp property in descending order.
 * @param a - The first item in the array.
 * @param b - The second item in the comparison.
 */
const sortByTimeStampDesc = (a, b) =>
  b.timestamp && b.timestamp.localeCompare(a.timestamp);

/**
 * It returns a list of deploys with the given symbol and status
 * @param [] - [symbol] - symbol of the token
 * @returns An array of deploys.
 */
export const useDeploysWithStatus = ({ symbol, publicKey, status } = {}) => {
  const dispatch = useDispatch();

  const transfersDeployList = useSelector(state =>
    getDeploysTransfer(state, { publicKey, symbol }),
  );

  const pendingTransferDeployHash = transfersDeployList
    .filter(deploy => deploy.status === 'pending')
    .map(deploy => deploy.deployHash);

  useEffect(() => {
    if (pendingTransferDeployHash && pendingTransferDeployHash.length) {
      (async () => {
        const data = await apis.getTransferDeploysStatusAPI({
          deployHash: pendingTransferDeployHash,
        });
        await updateTransferDeployStatus(publicKey, Keys.deploysTransfer, data);
        dispatch(allActions.main.loadLocalStorage());
      })();
    }
  }, [JSON.stringify(pendingTransferDeployHash)]);

  return transfersDeployList
    .filter(
      transfer =>
        (symbol ? transfer.symbol === symbol : true) &&
        (status ? transfer.status === status : true),
    )
    .sort(sortByTimeStampDesc);
};
