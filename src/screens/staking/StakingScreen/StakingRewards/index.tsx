import React from 'react';
import { scale } from 'device';
import { getStakingRewards } from 'services/StakingRewards/stakingRewardsApis';
import { useQuery } from 'react-query';
import { StyleSheet, RefreshControl } from 'react-native';
import { StakingRewardItem } from './StakingRewardItem';
import { FlatList } from 'react-native-gesture-handler';

interface IStakingRewardsProps {
  publicKey: string;
}

export const StakingRewards: React.FC<IStakingRewardsProps> = ({ publicKey }) => {
  const {
    data: rewards,
    refetch,
    isFetching,
  } = useQuery('stakingRewards', () => getStakingRewards(publicKey, 1), {
    select: data => data?.docs || [],
  });

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainerStyle}
      data={rewards}
      renderItem={reward => <StakingRewardItem value={reward.item} />}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />}
    />
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: scale(100),
  },
});
