import React, { useRef } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetNFTHistories } from 'screens/nft/hooks/useGetNFTHistories';
import { useSelectedAccount } from 'utils/hooks/useAccountInfo';
import TransferNFTHistoryItem from '../TransferNFTHistoryItem';
import { useScrollToTop } from '@react-navigation/native';
import { scale } from 'device';
import { NFTHistory } from 'screens/nft/types/nftHistory';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import MainRouter from 'navigation/stack/MainRouter';

const ListTransferNFTHistories = () => {
  const account = useSelectedAccount();
  const navigation = useStackNavigation();

  const scrollViewRef = useRef<any>();
  useScrollToTop(scrollViewRef);

  const { data: histories, isLoading, isRefetching, refetch } = useGetNFTHistories(account.publicKey);

  const handleOnPress = (nftHistory: NFTHistory) => {
    navigation.navigate(MainRouter.TRANSFER_NFT_HISTORY_SCREEN, {
      deploy: nftHistory,
    });
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      showsVerticalScrollIndicator={false}
      style={{ marginTop: scale(22) }}
      contentContainerStyle={styles.contentContainerStyle}
      refreshControl={<RefreshControl refreshing={isRefetching || isLoading} onRefresh={refetch} />}
    >
      {histories?.map((history) => {
        return (
          <TouchableOpacity key={history.deployHash} onPress={() => handleOnPress(history)}>
            <TransferNFTHistoryItem nftHistory={history} />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default ListTransferNFTHistories;

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: scale(330),
  },
});
