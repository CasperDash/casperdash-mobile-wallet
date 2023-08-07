/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, Modal, View, ScrollView } from 'react-native';

import { BigNumber } from '@ethersproject/bignumber';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, IconAttributes, IconCopy, images, textStyles } from 'assets';
import { CButton, CFastImage, CHeader, CLayout, Row } from 'components';
import { device, scale } from 'device';
import { INFTInfo } from 'services/NFT/nftApis';
import { copyToClipboard } from 'utils/hooks/useCopyClipboard';

interface Props {
  route: any;
  navigation: any;
}

function NFTDetail({ route }: Props) {
  const [open, setOpen] = useState(false);
  const [showAttributes, setShowAttributes] = useState(true);
  const { bottom } = useSafeAreaInsets();
  const data: INFTInfo = route.params;

  const { image, contractAddress, metadata, nftName, contractName, totalSupply } = data;

  const onOpenModal = () => {
    setOpen(!open);
  };
  // const ShareSocial = async () => {
  //   try {
  //     const ShareResponse = await Share.share({
  //       message: contractAddress,
  //       url: contractAddress,
  //       title: contractAddress,
  //     });
  //   } catch (error) {
  //     console.log('Error =>', error);
  //   }
  // };

  return (
    <CLayout statusBgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} bgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <CHeader title={nftName} style={{ backgroundColor: colors.cF8F8F8 }} />
        <TouchableOpacity onPress={onOpenModal} style={{ position: 'relative', marginTop: scale(24) }}>
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: bottom + scale(60) }}
          style={styles.scrollView}
        >
          <View style={{ width: '100%', paddingTop: scale(10) }}>
            {/* TODO:follow the figma's design
          <View style={styles.headerInformation}>
            <Text style={styles.title}>Current Price</Text>
            <View style={styles.flex}>
              <View style={styles.iconShareWrapper}>
                <IconTwitter />
              </View>
              <View style={styles.iconShareWrapper}>
                <IconInstagram />
              </View>
              <View style={styles.iconShareWrapper}>
                <IconFacebook />
              </View>
            </View>
          </View>

          <View style={styles.flexStart}>
            <Image
              source={valid ? images.symbol_cspr : images.imgnft}
              style={styles.imagePrice}
              onError={() => setValid(false)}
            />
            <Text style={styles.textPrice}>45.89</Text>
            <Text style={styles.textPriceConvert}>(~$111)</Text>
          </View>
          <Text style={styles.time}>2021-11-09 23:45</Text> */}
            <View style={styles.flexStart}>
              <Text style={styles.labelContract}>Total Supply:</Text>
              <Text style={styles.contractContent}> {BigNumber.from(totalSupply.hex).toNumber()}</Text>
            </View>
            <View style={styles.flexStart}>
              <Text style={styles.labelContract}>Contract Name:</Text>
              <Text style={styles.contractContent}> {contractName}</Text>
            </View>
            <View style={styles.flexStart}>
              <Text style={styles.labelContract}>Contract Address:</Text>
              <CButton onPress={() => copyToClipboard(contractAddress)}>
                <Row.C mt={6}>
                  <Text numberOfLines={1} ellipsizeMode={'middle'} style={styles.contractAddressText}>
                    {`${contractAddress}  `}
                    <IconCopy style={styles.iconCopy} />
                  </Text>
                </Row.C>
              </CButton>
            </View>

            <TouchableOpacity
              style={{ marginBottom: scale(24), marginTop: scale(16) }}
              onPress={() => setShowAttributes(!showAttributes)}
            >
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Attributes</Text>
                <IconAttributes style={showAttributes ? styles.showAttribute : styles.hideAttribute} />
              </View>
            </TouchableOpacity>
            {showAttributes && (
              <View style={styles.metaData}>
                {metadata.map((item: { key: string; value: string }) => (
                  <View key={item.key} style={styles.metaDataItem}>
                    <Text style={styles.keyMetaData}>{item.key}</Text>
                    <Text style={styles.valueMetaData}>{item.value}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
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
      </View>
    </CLayout>
  );
}

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#F8F8F8',
    height: device.h + 50,
  },
  titleWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    fontSize: scale(16),
    fontWeight: '500',
    marginRight: scale(16),
  },
  arrow: {
    transform: [{ rotateX: '180deg' }],
    color: colors.N3,
    fontSize: scale(20),
    fontWeight: '700',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(20),
    paddingVertical: scale(20),
    marginBottom: scale(24),
  },
  flexStart: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: scale(16),
  },

  totalSupply: {
    ...textStyles.Sub1,
    fontSize: scale(16),
    fontWeight: '500',
    color: colors.N3,
  },
  imagePrice: {
    width: scale(40),
    height: scale(40),
  },
  textPrice: {
    color: colors.N2,
    fontWeight: '600',
    fontSize: scale(32),
    marginHorizontal: scale(8),
  },
  textPriceConvert: {
    color: colors.N3,
    fontWeight: '500',
    fontSize: scale(16),
  },
  time: {
    color: colors.N3,
    marginTop: scale(20),
  },
  iconShareWrapper: {
    padding: scale(8),
    marginLeft: scale(24),
    backgroundColor: '#E6E8EC',
    borderRadius: scale(50),
  },
  copyClipboard: {
    marginVertical: scale(20),
  },
  textCopy: {
    marginLeft: scale(20),
  },
  flexContract: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: scale(20),
  },
  labelContract: {
    ...textStyles.Sub1,
    flexWrap: 'wrap',
    fontSize: scale(16),
    fontWeight: '500',
    color: colors.N3,
  },
  iconCopy: {
    width: 50,
    height: 50,
  },
  contractAddressText: {
    fontSize: scale(16),
    fontWeight: '400',
    color: colors.N2,
  },
  contractContent: {
    ...textStyles.Body1,
    fontSize: scale(16),
    color: colors.N2,
  },
  iconArrow: {
    width: scale(32),
    height: scale(24),
  },
  name: {
    fontWeight: '600',
    fontSize: scale(24),
    color: colors.N2,
    maxWidth: scale(260),
  },
  scrollView: {
    paddingHorizontal: scale(20),
    marginBottom: scale(40),
  },
  nftImage: {
    width: device.w,
    height: scale(189),
  },
  nftImageFull: {
    width: device.w - 60,
    height: device.h - 60,
    resizeMode: 'contain',
  },

  headerInformation: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: scale(15),
    marginTop: scale(10),
    flexDirection: 'row',
  },
  contractAdress: {
    paddingVertical: scale(20),
  },
  shareText: {
    fontWeight: '600',
    fontSize: scale(16),
  },
  metaData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  metaDataItem: {
    padding: scale(16),
    marginBottom: scale(20),
    borderRadius: scale(16),
    backgroundColor: colors.W1,
    width: device.w / 2 - 30,
  },
  keyMetaData: {
    ...textStyles.Body2,
    color: colors.N3,
    marginBottom: scale(14),
  },
  valueMetaData: {
    ...textStyles.Body2,
  },
  modal: {
    width: device.w,
    height: device.h,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    position: 'absolute',
    top: scale(64),
    left: device.w / 2 - 20,
  },
  showAttribute: {
    transform: [{ rotateX: '0deg' }],
  },
  hideAttribute: {
    transform: [{ rotateX: '180deg' }],
  },
});

export default React.memo(NFTDetail);
