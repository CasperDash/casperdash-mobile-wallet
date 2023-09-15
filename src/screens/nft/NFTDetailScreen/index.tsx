import React from 'react';
import { colors, IconSend } from 'assets';
import { CHeader, CLayout } from 'components';
import CButtonIcon from 'components/CButtonIcon';
import { device, scale } from 'device';

import { StyleSheet, View } from 'react-native';
import { INFTInfo } from 'services/NFT/nftApis';
import NFTImage from '../components/NFTImage';
import NFTAttributes from '../components/NFTAttributes';
import { useDisplayType } from '../hooks/useDisplayType';
import { useUpdateDisplayType } from '../hooks/useUpdateDisplayType';
import { DisplayTypes } from 'redux_manager/nft/nft_reducer';
import TransferNFTForm from './TransferNFTForm';

interface Props {
  route: any;
  navigation: any;
}

function NFTDetail({ route }: Props) {
  const data: INFTInfo = route.params;
  const displayType = useDisplayType();
  const updateDisplayType = useUpdateDisplayType();

  const {
    image,
    contractAddress,
    metadata,
    nftName,
    contractName,
    totalSupply,
    tokenId,
    tokenStandardId,
    isTransfarable,
  } = data;

  const handleOnSendPress = () => {
    updateDisplayType(DisplayTypes.SEND_FORM);
  };

  return (
    <CLayout statusBgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} bgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <CHeader title={nftName} style={{ backgroundColor: colors.cF8F8F8 }} />
        <NFTImage name={nftName} tokenId={tokenId} image={image} />
        {displayType === DisplayTypes.ATTRIBUTES && isTransfarable && (
          <View style={styles.headerInformation}>
            <View style={styles.flex}>
              <CButtonIcon style={styles.button} icon={<IconSend width="18" />} onPress={handleOnSendPress} />
            </View>
          </View>
        )}
        {displayType === DisplayTypes.ATTRIBUTES && (
          <NFTAttributes
            contractAddress={contractAddress}
            contractName={contractName}
            totalSupply={totalSupply}
            tokenStandardId={tokenStandardId}
            metadata={metadata}
          />
        )}
        {displayType === DisplayTypes.SEND_FORM && <TransferNFTForm nft={data} />}
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
  headerInformation: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: scale(36),
    height: scale(36),
  },
});

export default React.memo(NFTDetail);
