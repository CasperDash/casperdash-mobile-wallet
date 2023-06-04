import React from 'react';
import { colors, images, textStyles } from 'assets';
import { device, scale } from 'device';
import { navigate } from 'navigation/RootNavigation';
import MainRouter from 'navigation/stack/MainRouter';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CFastImage } from 'components';
import { INFTInfo } from 'services/NFT/nftApis';

function NFTItem({ data, index }: { data: INFTInfo; index: number }) {
  const { image, nftName, contractName, tokenId } = data;

  const onNavigationDetail = () => {
    navigate(MainRouter.NFTDETAIL_SCREEN, data);
  };

  return (
    <View style={[styles.nftItemWrapper, index % 2 === 0 && { marginRight: scale(15) }]}>
      <TouchableOpacity onPress={onNavigationDetail}>
        <View style={styles.imageWrapper}>
          <CFastImage
            colorDef={'transparent'}
            source={image}
            resizeMode={'contain'}
            sourceDef={images.imgnft}
            style={styles.nftImage}
            width={scale(164)}
            height={scale(128)}
          />
        </View>
        <View style={styles.nftItemContent}>
          <Text style={styles.nftName} numberOfLines={1}>
            {nftName ?? tokenId ?? contractName}
          </Text>
          <Text style={styles.contractNameNFT}>{contractName}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
export default React.memo(NFTItem);

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
    borderRadius: scale(16),
    overflow: 'hidden',
  },
  nftName: {
    ...textStyles.Sub1,
    fontSize: scale(16),
    fontWeight: '500',
    color: colors.N2,
    marginBottom: scale(12),
  },
  contractNameNFT: {
    ...textStyles.Body2,
    color: colors.N3,
  },
});
