/* eslint-disable react-native/no-inline-styles */
import Clipboard from '@react-native-clipboard/clipboard';
import {
  colors,
  IconArrowLeft,
  IconAttributes,
  IconCopy,
  IconFacebook,
  IconInstagram,
  IconTwitter,
  images,
} from 'assets';
import { Row } from 'components';
import { MessageType } from 'components/CMessge/types';
import { device, scale } from 'device';

import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
// import { Props } from 'react-native-tab-view/lib/typescript/TabBarItem';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

interface Props {
  route: any;
  navigation: any;
}

function NFTDetail({ route, navigation }: Props) {
  const [valid, setValid] = useState(true);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [showAttributes, setshowAttributes] = useState(true);
  const [loading, setLoading] = useState(false);
  const data = route.params;
  const {
    nftImage,
    contractAddress,
    metadata,
    nftName,
    nftContractName,
    totalSupply,
  } = data;

  const onBack = () => {
    navigation.goBack();
    // navigate(NFTRouter.NFT_SCREEN, null);
  };
  const copyToClipboard = async () => {
    await Clipboard.setString(contractAddress);
    const message = {
      message: 'Copied to Clipboard',
      type: MessageType.normal,
    };
    dispatch(allActions.main.showMessage(message, 1000));
  };

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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <IconArrowLeft width={32} height={24} />
        </TouchableOpacity>
        <Text style={styles.name}>{nftName}</Text>
        <Text />
      </View>
      <TouchableOpacity onPress={onOpenModal} style={{ position: 'relative' }}>
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
      </TouchableOpacity>
      <ScrollView style={styles.scrollView}>
        <View style={{ width: '100%' }}>
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
          <View style={styles.headerInformation}>
            <Text style={styles.totalSupply}>Total Supply :{totalSupply}</Text>
          </View>
          <View style={styles.flexStart}>
            <Text style={styles.labelContract}>Contract Name:</Text>
            <Text style={styles.contractContent}> {nftContractName}</Text>
          </View>
          <View style={{ marginVertical: scale(20) }}>
            <Text style={styles.labelContract}>Contract Address:</Text>
            <Row.C>
              <Text
                onPress={copyToClipboard}
                numberOfLines={1}
                ellipsizeMode={'middle'}
                style={styles.contractAddressText}>
                {contractAddress}
              </Text>
              <IconCopy onPress={copyToClipboard} style={styles.iconCopy} />
            </Row.C>
          </View>

          <TouchableOpacity onPress={() => setshowAttributes(!showAttributes)}>
            <View style={styles.titleWrapper}>
              <Text style={styles.title}>Attributes </Text>
              <IconAttributes
                style={
                  showAttributes ? styles.showAttribute : styles.hideAttribute
                }
              />
            </View>
          </TouchableOpacity>
          {showAttributes && (
            <View style={styles.metaData}>
              {metadata.map(
                (item: { name: string; key: string; value: string }) => (
                  <View key={item.name} style={styles.metaDataItem}>
                    <Text style={styles.keyMetaData}>{item.key}</Text>
                    <Text style={styles.valueMetaData}>{item.value}</Text>
                  </View>
                ),
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <Modal animationType="fade" transparent={true} visible={open}>
        <TouchableOpacity onPress={onOpenModal} style={styles.modal}>
          <Image
            source={valid ? { uri: nftImage } : images.imgnft}
            style={styles.nftImageFull}
            onError={() => setValid(false)}
          />
        </TouchableOpacity>
      </Modal>
    </View>
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
    paddingTop: scale(20),
    backgroundColor: '#F8F8F8',
    height: device.h + 50,
  },
  titleWrapper: {
    marginBottom: scale(24),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    color: colors.N3,
    fontSize: scale(16),
    fontWeight: '500',
    marginRight: scale(25),
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
  },

  totalSupply: {
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
    marginRight: scale(10),
    width: device.w - 75,
  },
  contractContent: {
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
    color: colors.N3,
    marginBottom: scale(14),
  },
  valueMetaData: {
    color: colors.N2,
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
