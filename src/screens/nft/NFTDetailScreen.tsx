import { colors, IconArrowLeft, images } from 'assets';
import { device } from 'device';
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
      <ScrollView>
        <View style={styles.infomation}>
          <View style={styles.headerInformation}>
            <Text>Total Supply :{totalSupply}</Text>
            <View>
              <TouchableOpacity onPress={ShareSocial}>
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.contractAdress}>
            <Text>Contract Adress :</Text>
            <Text>{contractAddress}</Text>
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
  container: {
    paddingTop: 20,
    backgroundColor: '#F8F8F8',
    height: device.h,
  },
  titleWrapper: {
    paddingHorizontal: 20,
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    color: colors.N3,
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    transform: [{ rotateX: '180deg' }],
    color: colors.N3,
    fontSize: 20,
    fontWeight: '700',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 24,
  },
  iconArrow: {
    width: 32,
    height: 24,
  },
  name: {
    fontWeight: '600',
    fontSize: 24,
    color: colors.N2,
    maxWidth: 260,
  },
  nftImage: {
    width: device.w,
    height: 189,
  },
  infomation: {},
  headerInformation: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 10,
    flexDirection: 'row',
  },
  contractAdress: {
    padding: 20,
  },
  shareText: {
    fontWeight: '600',
    fontSize: 16,
  },
  metaData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  metaDataItem: {
    padding: 16,
    marginBottom: 20,
    borderRadius: 16,
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
