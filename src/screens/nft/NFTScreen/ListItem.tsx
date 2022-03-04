import { useNavigation } from '@react-navigation/native';
import { colors, images } from 'assets';
import { device, scale } from 'device';
import NFTRouter from 'navigation/NFTNavigation/NFTRouter';
import { navigate } from 'navigation/RootNavigation';

import React, { useState } from 'react';

import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import { addNFTContactAdress } from 'redux_manager/nft/nft_action';

export const getMetadataByKey = (metadata: any[], key: any) => {
  const data = metadata.find(item => item.key === key) || {};
  return data.value;
};

function NFTItem({ data }: any) {
  const dispatch = useDispatch();
  const [valid, setValid] = useState(true);
  const [loading, setLoading] = useState(false);

  if (!data) {
    return null;
  }

  const nftBackground = getMetadataByKey(data.metadata, 'background');
  const metadata = data.metadata.filter(
    item =>
      item.key !== 'name' && item.key !== 'image' && item.key !== 'background',
  );

  const onNavigationDetail = () => {
    navigate(NFTRouter.NFT_DETAIL, {
      ...data,
      metadata: metadata,
      background: nftBackground,
      totalSupply: parseInt(data.totalSupply.hex, 16),
    });
  };
  const { nftImage, nftName, nftContractName } = data;
  return (
    <View style={styles.nftItemWrapper}>
      <TouchableOpacity onPress={onNavigationDetail}>
        <View style={styles.imageWrapper}>
          <Image
            source={valid ? { uri: nftImage } : images.imgnft}
            style={styles.nftImage}
            onError={() => setValid(false)}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={colors.N2} />
            </View>
          )}
        </View>
        <View style={styles.nftItemContent}>
          <Text style={styles.nftName}>{nftName}</Text>
          <Text style={styles.contractNameNFT}>{nftContractName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
export default NFTItem;

const styles = StyleSheet.create({
  nftItemWrapper: {
    width: (device.w - 47) / 2,
    marginBottom: scale(16),
    borderWidth: 1,
    borderColor: colors.N5,
    borderRadius: scale(16),
  },

  nftItemContent: {
    padding: scale(16),
  },
  imageWrapper: {
    position: 'relative',
  },
  nftImage: {
    width: '100%',
    height: scale(128),
    borderRadius: scale(16),
  },
  nftName: {
    fontSize: scale(16),
    fontWeight: '500',
    color: colors.N2,
    marginBottom: scale(12),
  },
  contractNameNFT: {
    color: colors.N3,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});