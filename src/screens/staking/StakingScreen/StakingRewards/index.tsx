import React from 'react';
import { scale } from 'device';
import { getStakingRewards } from 'services/StakingRewards/stakingRewardsApis';
import { useQuery } from 'react-query';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { StakingRewardItem } from './StakingRewardItem';

interface IStakingRewardsProps {
  publicKey: string;
  renderHeader: Function;
}

export const StakingRewards: React.FC<IStakingRewardsProps> = ({
  publicKey,
  renderHeader,
}) => {
  const {
    data: rewards,
    refetch,
    isFetching,
  } = useQuery('stakingRewards', () => getStakingRewards(publicKey, 1), {
    select: data => data?.docs || [],
  });
  console.log('🚀 ~ file: index.tsx:24 ~ rewards:', rewards);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ marginTop: scale(22) }}
      contentContainerStyle={styles.contentContainerStyle}
      refreshControl={
        <RefreshControl refreshing={isFetching} onRefresh={() => refetch()} />
      }>
      {renderHeader()}
      {rewards?.map((item, i) => (
        <StakingRewardItem value={item} key={i} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: scale(100),
  },
});
