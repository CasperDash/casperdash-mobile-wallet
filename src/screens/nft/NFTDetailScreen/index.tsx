import React, { useMemo } from 'react';
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
import { MAP_WASM } from '../utils/nft';

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
    isUsingSessionCode,
    wasmName,
  } = data;

  const handleOnSendPress = () => {
    updateDisplayType(DisplayTypes.SEND_FORM);
  };

  const isShowSendButton = useMemo(() => {
    // If displayType is not ATTRIBUTES or isTransfarable is false, don't show send button
    if (displayType !== DisplayTypes.ATTRIBUTES || !isTransfarable) {
      return false;
    }

    // If isUsingSessionCode is true but wasmName is not exist in MAP_WASM, don't show send button
    if (isUsingSessionCode && (!wasmName || !MAP_WASM[wasmName])) {
      return false;
    }

    return true;
  }, [displayType, isTransfarable, isUsingSessionCode, wasmName]);

  return (
    <CLayout statusBgColor={colors.cF8F8F8} edges={['right', 'top', 'left']} bgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <CHeader title={nftName} style={{ backgroundColor: colors.cF8F8F8 }} />
        <NFTImage name={nftName} tokenId={tokenId} image={image} />
        {isShowSendButton && (
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
            tokenId={tokenId}
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
