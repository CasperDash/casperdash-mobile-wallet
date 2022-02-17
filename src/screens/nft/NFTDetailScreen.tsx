import Clipboard from '@react-native-clipboard/clipboard';
import { colors, IconArrowLeft, images } from 'assets';
import { device, scale } from 'device';
import NFTRouter from 'navigation/NFTNavigation/NFTRouter';
import { navigate } from 'navigation/RootNavigation';
import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Share,
  View,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import { Props } from 'react-native-tab-view/lib/typescript/TabBarItem';

function NFTDetail({ route }: Props) {
  const [valid, setValid] = useState(true);

  const data = route.params;
  const {
    background,
    nftImage,
    contractAddress,
    metadata,
    nftName,
    nftContractName,
    totalSupply,
  } = data;

  const onBack = () => {
    navigate(NFTRouter.NFT_SCREEN);
  };
  const copyToClipboard = () => {
    Clipboard.setString(contractAddress);
    ToastAndroid.showWithGravity(
      'Coppy scucess',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };
  const ShareSocial = async () => {
    try {
      const ShareResponse = await Share.share({
        message: contractAddress,
        url: contractAddress,
        title: contractAddress,
      });
    } catch (error) {
      console.log('Error =>', error);
    }
  };
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
        <View style={styles.infomation}>
          <View style={styles.headerInformation}>
            <Text>Total Supply :{totalSupply}</Text>
            <View>
              <TouchableOpacity onPress={ShareSocial}>
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
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
              <Text>{CollapseText(contractAddress)}</Text>
              <Text style={styles.textCopy}>Copy</Text>
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

function CollapseText(string: any) {
  console.log(string);
  if (typeof string !== 'string') {
    return 'Not a string';
  }
  const start = string.slice(0, 15);
  const end = string.slice(-5, string.length);
  const newString = start + '...' + end;
  return newString;
}

const styles = StyleSheet.create({
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
  },
  nftImage: {
    width: device.w,
    height: scale(189),
  },
  infomation: {},
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
