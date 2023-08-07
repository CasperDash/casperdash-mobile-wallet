import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { allActions } from 'redux_manager';
import { getDeploysTransfer, updateTransferDeployStatus } from 'utils/selectors/transfer';

import { useDeployStatus } from './useDeployStatus';

/**
 * Sort the array by the timestamp property in descending order.
 * @param a - The first item in the array.
 * @param b - The second item in the comparison.
 */
const sortByTimeStampDesc = (a: any, b: any) => b.timestamp && b.timestamp.localeCompare(a.timestamp);

/**
 * It returns a list of deploys with the given symbol and status
 * @param [] - [symbol] - symbol of the token
 * @returns An array of deploys.
 */
export const useDeploysWithStatus = ({ symbol, publicKey, status }: any = {}) => {
  const dispatch = useDispatch();

  const transfersDeployList = useSelector((state) =>
    //@ts-ignore
    getDeploysTransfer(state, { publicKey, symbol }),
  );

  const pendingTransferDeployHash = transfersDeployList
    .filter((deploy: any) => deploy.status === 'pending')
    .map((deploy: any) => deploy.deployHash);

  const { data } = useDeployStatus(pendingTransferDeployHash);

  useEffect(() => {
    if (data?.length) {
      (async () => {
        await updateTransferDeployStatus(publicKey, data);
        dispatch(allActions.main.loadLocalStorage());
      })();
    }
  }, [data, dispatch, publicKey]);

  return transfersDeployList
    .filter(
      (transfer: any) => (symbol ? transfer.symbol === symbol : true) && (status ? transfer.status === status : true),
    )
    .sort(sortByTimeStampDesc);
};
