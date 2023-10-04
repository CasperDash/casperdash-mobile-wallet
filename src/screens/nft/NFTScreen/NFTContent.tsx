import { colors, images, textStyles, IconHistory } from 'assets';
import { scale } from 'device';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import NFTItem from './ListItem';
import { INFTInfo } from 'services/NFT/nftApis';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ListTransferNFTHistories from '../components/ListTransferNFTHistories';
import { useViewType } from '../hooks/useViewType';
import { useUpdateViewType } from '../hooks/useUpdateViewType';
import { ViewTypes } from 'redux_manager/nft/nft_reducer';

type Props = {
  nfts: INFTInfo[];
  isFetching: boolean;
  refetch: () => void;
};

const renderItem = ({ item, index }: { item: INFTInfo; index: number }) => {
  return <NFTItem data={item} key={`${index} - ${item.tokenId}`} index={index} />;
};

const renderNoData = () => {
  return (
    <View style={styles.noNFT}>
      <Image source={images.nonft} style={styles.imageNoNFT} />
      <Text style={styles.textNoNFT}>There are no item to display</Text>
    </View>
  );
};

export const NFTContent = ({ nfts, isFetching, refetch }: Props) => {
  const viewType = useViewType();
  const updateViewType = useUpdateViewType();

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => updateViewType(ViewTypes.LIST_NFTS)}>
          <Text style={[styles.numNft, { color: viewType === ViewTypes.LIST_NFTS ? colors.R3 : colors.N1 }]}>
            {nfts.length + ` ${nfts.length < 2 ? 'Item' : 'Items'}`}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => updateViewType(ViewTypes.HISTORIES)}>
          <IconHistory fill={viewType === ViewTypes.HISTORIES ? colors.R3 : colors.N1} />
        </TouchableOpacity>
      </View>
      {viewType === ViewTypes.LIST_NFTS ? (
        <FlatList
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.nftsList}
          data={nfts}
          refreshing={isFetching}
          extraData={nfts}
          onRefresh={refetch}
          keyExtractor={(item, index) => `${index} - ${item.tokenId}`}
          ListEmptyComponent={renderNoData}
          renderItem={renderItem}
        />
      ) : (
        <ListTransferNFTHistories />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  nftsList: {
    paddingBottom: scale(330),
  },
  tabs: {
    display: 'flex',
    flexDirection: 'row',
  },
  numNft: {
    ...textStyles.Sub1,
    marginBottom: scale(24),
    marginRight: scale(16),
  },
  noNFT: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: scale(60),
    marginBottom: scale(20),
  },
  imageNoNFT: {
    width: scale(200),
    height: scale(200),
  },
  textNoNFT: {
    ...textStyles.Body1,
    color: colors.N4,
  },
});
