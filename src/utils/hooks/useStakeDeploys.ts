import _orderBy from 'lodash/orderBy';
import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDeployStakes, updateStakesDeployStatus } from '../selectors/stake';
import { ENTRY_POINT_UNDELEGATE, ENTRY_POINT_DELEGATE, DeployStatus } from '../constants/key';
import { IconStatusReceive, IconStatusSend } from 'assets';
import { allActions } from 'redux_manager';
import { useDeployStatus } from './useDeployStatus';
import { useQuery } from 'react-query';
import { ERequestKeys } from 'utils/constants/requestKeys';
import { getAccountDelegation } from 'services/User/userApis';
import { IAccountDelegationResponse } from 'services/User/userTypes';

export const useStakedInfo = (publicKey: string) => {
  const query = useQuery({
    queryKey: [ERequestKeys.accountDelegation, publicKey],
    queryFn: () => getAccountDelegation(publicKey),
    enabled: !!publicKey,
  });
  return query;
};

/**
 * It returns an icon based on the value of the stake
 * @param {number} value - number - the value of the transaction
 * @returns the value of the IconStatusReceive or IconStatusSend.
 */
export const getStakeIcon = (value: number) => {
  return value > 0 ? IconStatusReceive : IconStatusSend;
};

export interface IStakedInfo extends IAccountDelegationResponse {
  pendingDelegatedAmount: number;
  pendingUndelegatedAmount: number;
}

export interface IHistoryInfo {
  icon: any;
  status: string;
  type: string;
  validatorPublicKey: string;
  delegatorPublicKey: string;
  stakedAmount: number;
  timestamp: string;
}

export const useStakeFromValidators = (publicKey: string) => {
  const dispatch = useDispatch();

  const stakeDeployList = useSelector((state) =>
    //@ts-ignore
    getDeployStakes(state, { publicKey }),
  );
  const pendingItems = stakeDeployList.filter(
    (stake: any) => stake.status === DeployStatus.pending || stake.status === DeployStatus.undelegating,
  );

  const {
    data: deploysStatus,
    refetch: refetchStatus,
    isLoading: isLoadingStatus,
    isRefetching: isRefetchingStatus,
  } = useDeployStatus(pendingItems.map((deploy: any) => deploy.deployHash));

  const { data: stakedInfo, refetch, isLoading, isRefetching } = useStakedInfo(publicKey);

  useEffect(() => {
    if (deploysStatus?.length) {
      (async () => {
        if (!publicKey) {
          return;
        }

        await updateStakesDeployStatus(publicKey, deploysStatus);
        dispatch(allActions.main.loadLocalStorage());
      })();
    }
  }, [deploysStatus, dispatch, publicKey]);

  const stakedValidators = useMemo<IStakedInfo[]>(() => {
    return (
      stakedInfo?.map((item: IAccountDelegationResponse) => {
        const pendingDelegated: any[] = pendingItems.filter(
          (stake: any) => stake.validator === item.validatorPublicKey && stake.entryPoint === ENTRY_POINT_DELEGATE,
        );
        const pendingUndelegated: any[] = pendingItems.filter(
          (stake: any) => stake.validator === item.validatorPublicKey && stake.entryPoint === ENTRY_POINT_UNDELEGATE,
        );

        return {
          ...item,
          stakedAmount: item.stakedAmount,
          pendingDelegatedAmount: pendingDelegated.length
            ? pendingDelegated.reduce<number>((acc, pendingItem: any) => acc + pendingItem.amount, 0)
            : 0,
          pendingUndelegatedAmount: pendingUndelegated.length
            ? pendingUndelegated.reduce<number>((acc: number, pendingItem: any) => acc + pendingItem.amount, 0)
            : 0,
        };
      }) || []
    );
  }, [stakedInfo, pendingItems]);

  const refetchInfo = () => {
    refetch();
    refetchStatus();
  };

  return {
    stakedValidators,
    refetchInfo,
    isLoading: isLoading || isLoadingStatus,
    isRefetching: isRefetching || isRefetchingStatus,
  };
};

export const useStakedHistory = (publicKey: string): IHistoryInfo[] => {
  const stakeDeployList: any[] = useSelector((state) =>
    //@ts-ignore
    getDeployStakes(state, { publicKey }),
  );

  return _orderBy(
    stakeDeployList.map<IHistoryInfo>((item: any) => {
      return {
        validatorPublicKey: item.validator,
        delegatorPublicKey: publicKey,
        stakedAmount: item.entryPoint === ENTRY_POINT_UNDELEGATE ? -item.amount : item.amount,
        icon: item.entryPoint === ENTRY_POINT_UNDELEGATE ? IconStatusSend : IconStatusReceive,
        status: item.status,
        type: item.entryPoint,
        timestamp: item.timestamp,
      };
    }),
    ['timestamp'],
    ['desc'],
  );
};
