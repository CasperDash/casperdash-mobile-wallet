import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { device, scale } from 'device';
import { colors, images, textStyles } from 'assets';
import { CFastImage } from 'components';

type Props = {
  onPress?: () => void;
  contractHash?: string;
  tokenId?: string;
  name?: string;
  logo?: string;
};

const NFTItem = ({ logo, contractHash, name, tokenId }: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <CFastImage
          disabled
          colorDef={'transparent'}
          source={logo}
          resizeMode={'contain'}
          sourceDef={images.imgnft}
          style={styles.nftImage}
          width={device.w}
          height={scale(189)}
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, styles.name]} numberOfLines={1} ellipsizeMode={'middle'}>
          {name ?? contractHash}
        </Text>
        <Text style={[styles.text, styles.tokenId]}>#{tokenId}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: scale(16),
    lineHeight: scale(30),
    maxWidth: scale(220),
  },
  name: {
    ...textStyles.Sub1,
    color: colors.N2,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scale(16),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  nftImage: {
    width: device.w,
    height: scale(170),
  },
  tokenId: {
    marginLeft: scale(8),
  },
  contractHash: {
    ...textStyles.Body1,
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
    width: scale(140),
  },
  iconWrapper: {
    marginTop: scale(16),
    flexBasis: scale(180),
    alignItems: 'center',
  },
  icon: {
    width: scale(160),
    height: scale(160),
  },
});

export default NFTItem;
