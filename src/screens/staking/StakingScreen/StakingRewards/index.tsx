import React, { useMemo } from 'react';
import { scale } from 'device';
import { getStakingRewards } from 'services/StakingRewards/stakingRewardsApis';
import { useInfiniteQuery, useQuery } from 'react-query';
import { StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { StakingRewardItem } from './StakingRewardItem';
import { FlatList } from 'react-native-gesture-handler';
import { IStakingRewardItem } from 'services/StakingRewards/stakingRewardsType';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NoData } from '../NoData';
import { getValidatorsDetail } from 'services/Validators/validatorsApis';
import { ERequestKeys } from 'utils/constants/requestKeys';

interface IStakingRewardsProps {
  publicKey: string;
}

export const StakingRewards: React.FC<IStakingRewardsProps> = ({ publicKey }) => {
  const { bottom } = useSafeAreaInsets();

  const {
    data: rewards,
    refetch,
    isFetching,
    fetchNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [ERequestKeys.stakingRewards],
    queryFn: ({ pageParam }) => getStakingRewards({ publicKey, pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pages.find((p) => p.number >= lastPage.page + 1)) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });

  const { data: validatorsDetail, isLoading: isLoadingValidatorsDetail } = useQuery({
    queryKey: [ERequestKeys.validatorsDetail],
    queryFn: () => getValidatorsDetail(),
  });

  const displayData = useMemo(() => {
    return rewards?.pages.reduce<IStakingRewardItem[]>((out, datum) => out.concat(datum.data), []);
  }, [rewards]);

  return (
    <>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainerStyle}
        data={displayData}
        renderItem={(reward) => <StakingRewardItem value={reward.item} validatorsDetail={validatorsDetail} />}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={() => {
              refetch();
            }}
          />
        }
        onEndReached={() => {
          fetchNextPage();
        }}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={<NoData isLoading={isLoading || isLoadingValidatorsDetail} bottom={bottom} />}
        ListFooterComponent={isFetching ? <ActivityIndicator /> : <></>}
      />
    </>
  );
};

const styles = StyleSheet.create({
  contentContainerStyle: {
    minHeight: scale(400),
    paddingBottom: scale(400),
  },
});
