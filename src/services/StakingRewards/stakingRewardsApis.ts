import { ICommonListResponse } from 'services/apiTypes';
import { IStakingRewardItem } from './stakingRewardsType';

type TRewardRequest = {
  pageParam: number;
  publicKey: string;
  limit?: number;
};

export const getStakingRewards = async ({
  publicKey,
  pageParam = 1,
  limit = 20,
}: TRewardRequest): Promise<ICommonListResponse<IStakingRewardItem>> => {
  const response = await fetch(
    `https://api.cspr.live/delegators/${publicKey}/rewards?page=${pageParam}&limit=${limit}`,
  );
  if (!response.ok) {
    throw new Error('Error on getting rewards');
  }

  return { ...(await response.json()), page: pageParam };
};
