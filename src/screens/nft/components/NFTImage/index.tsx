import React, { useState } from 'react';
import { CFastImage } from 'components';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { device, scale } from 'device';
import { colors, images, textStyles } from 'assets';

type Props = {
  image?: string;
  name?: string;
  tokenId?: string;
};

const NFTImage = ({ image, name, tokenId }: Props) => {
  const [open, setOpen] = useState(false);

  const onOpenModal = () => {
    setOpen(!open);
  };

  return (
    <>
      <TouchableOpacity onPress={onOpenModal} style={styles.touchableNFT}>
        <CFastImage
          disabled
          colorDef={'transparent'}
          source={image}
          resizeMode={'contain'}
          sourceDef={images.imgnft}
          style={styles.nftImage}
          width={device.w}
          height={scale(189)}
        />
      </TouchableOpacity>
      <View style={styles.content}>
        {name && (
          <Text style={[styles.text, styles.name]} numberOfLines={1} ellipsizeMode={'middle'}>
            {name}
          </Text>
        )}
        {tokenId && <Text style={[styles.text, styles.tokenId]}>#{tokenId}</Text>}
      </View>
      <Modal animationType="fade" transparent={true} visible={open}>
        <TouchableOpacity onPress={onOpenModal} style={styles.modal}>
          <CFastImage
            disabled
            colorDef={'transparent'}
            source={image}
            resizeMode={'contain'}
            sourceDef={images.imgnft}
            style={styles.nftImage}
            width={device.w - scale(60)}
            height={device.h - scale(60)}
          />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default NFTImage;

const styles = StyleSheet.create({
  touchableNFT: { position: 'relative', marginTop: scale(24) },
  nftImage: {
    width: device.w,
    height: scale(189),
  },
  nftImageFull: {
    width: device.w - 60,
    height: device.h - 60,
    resizeMode: 'contain',
  },
  modal: {
    width: device.w,
    height: device.h,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: scale(2),
    marginBottom: scale(16),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  tokenId: {
    marginLeft: scale(8),
  },
});
