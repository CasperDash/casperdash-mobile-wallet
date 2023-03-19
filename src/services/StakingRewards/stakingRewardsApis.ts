import { ICommonListResponse } from 'services/apiTypes';
import { IStakingRewardItem } from './stakingRewardsType';
import { NETWORK_URL } from 'utils/constants/key';

export const getStakingRewards = async (
  publicKey: string,
  page: number,
): Promise<ICommonListResponse<IStakingRewardItem>> => {
  const response = await fetch(`${NETWORK_URL}/user/${publicKey}/stakingRewards?page=${page}`);
  if (!response.ok) {
    throw new Error('Error on getting rewards');
  }
  return response.json();
};
