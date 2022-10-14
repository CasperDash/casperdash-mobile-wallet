import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getDeploysTransfer,
  updateTransferDeployStatus,
} from 'utils/selectors/transfer';
import { apis } from 'services';
import { allActions } from 'redux_manager';

/**
 * Sort the array by the timestamp property in descending order.
 * @param a - The first item in the array.
 * @param b - The second item in the comparison.
 */
const sortByTimeStampDesc = (a: any, b: any) =>
  b.timestamp && b.timestamp.localeCompare(a.timestamp);

/**
 * It returns a list of deploys with the given symbol and status
 * @param [] - [symbol] - symbol of the token
 * @returns An array of deploys.
 */
export const useDeploysWithStatus = ({
  symbol,
  publicKey,
  status,
}: any = {}) => {
  const dispatch = useDispatch();

  const transfersDeployList = useSelector(state =>
    //@ts-ignore
    getDeploysTransfer(state, { publicKey, symbol }),
  );

  const pendingTransferDeployHash = transfersDeployList
    .filter((deploy: any) => deploy.status === 'pending')
    .map((deploy: any) => deploy.deployHash);

  useEffect(() => {
    if (pendingTransferDeployHash && pendingTransferDeployHash.length) {
      (async () => {
        const data: any = await apis.getTransferDeploysStatusAPI({
          deployHash: pendingTransferDeployHash,
        });
        await updateTransferDeployStatus(publicKey, data);
        dispatch(allActions.main.loadLocalStorage());
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pendingTransferDeployHash), dispatch, publicKey]);

  return transfersDeployList
    .filter(
      (transfer: any) =>
        (symbol ? transfer.symbol === symbol : true) &&
        (status ? transfer.status === status : true),
    )
    .sort(sortByTimeStampDesc);
};
