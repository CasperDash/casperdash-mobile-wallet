import Clipboard from '@react-native-clipboard/clipboard';
import {
  colors,
  IconArrowLeft,
  IconCopy,
  IconFacebook,
  IconInstagram,
  IconTwitter,
  images,
} from 'assets';
import { MessageType } from 'components/CMessge/types';
import { device, scale } from 'device';
import NFTRouter from 'navigation/NFTNavigation/NFTRouter';
import { navigate } from 'navigation/RootNavigation';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  View,
  ScrollView,
} from 'react-native';
import { Props } from 'react-native-tab-view/lib/typescript/TabBarItem';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

function NFTDetail({ route }: Props) {
  const [valid, setValid] = useState(true);
  const dispatch = useDispatch();
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
    navigate(NFTRouter.NFT_SCREEN, null);
  };
  const copyToClipboard = async () => {
    await Clipboard.setString(contractAddress);
    const message = {
      message: 'Copied to Clipboard',
      type: MessageType.normal,
    };
    dispatch(allActions.main.showMessage(message, 1000));
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
      <Image
        source={valid ? { uri: nftImage } : images.imgnft}
        style={styles.nftImage}
        onError={() => setValid(false)}
      />
      <ScrollView style={styles.scrollView}>
        <View>
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
            <Text>Total Supply :{totalSupply}</Text>
          </View>
          <View>
            <Text>Contract Name:</Text>
            <Text> {nftContractName}</Text>
          </View>
          <View style={styles.contractAdress}>
            <Text>Contract Adress :</Text>
            <TouchableOpacity
              onPress={copyToClipboard}
              style={styles.copyClipboard}>
              <Text
                ellipsizeMode="middle"
                numberOfLines={1}
                style={styles.contractAddressText}>
                {contractAddress}
              </Text>
              <IconCopy />
            </TouchableOpacity>
          </View>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>Attributes </Text>
            <Text style={styles.arrow}> ^ </Text>
          </View>
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
        </View>
      </ScrollView>
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
    height: device.h,
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
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  textCopy: {
    marginLeft: scale(20),
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
  contractAddressText: {
    maxWidth: scale(180),
    marginRight: scale(10),
  },
  headerInformation: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingVertical: scale(20),
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
  },
  valueMetaData: {
    color: colors.N2,
  },
});

export default NFTDetail;
