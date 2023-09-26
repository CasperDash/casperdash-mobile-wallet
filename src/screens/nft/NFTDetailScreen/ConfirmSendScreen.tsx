import React from 'react';
import { Col } from 'components';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, textStyles } from 'assets';
import { device, scale } from 'device';
import CTextButton from 'components/CTextButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSendNFT } from '../hooks/useSendNFT';
import { getTokenStandardName } from '../utils/token';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import NFTRouter from 'navigation/NFTNavigation/NFTRouter';
import { DisplayTypes, ViewTypes } from 'redux_manager/nft/nft_reducer';
import { useUpdateDisplayType } from '../hooks/useUpdateDisplayType';
import { useUpdateViewType } from '../hooks/useUpdateViewType';
import { DeployTypes } from 'utils/helpers/parser';
import { INFTInfo } from 'services/NFT/nftApis';
import { useShowMessage } from 'utils/hooks/useShowMessage';
import { MessageType } from 'components/CMessge/types';
import { toMotes } from 'utils/helpers/currency';

type Props = {
  nft: INFTInfo;
  fee: number | string;
  receivingAddress: string;
};

const ConfirmSendNFTScreen = ({ nft, fee, receivingAddress }: Props) => {
  const { name, tokenId, contractAddress, tokenStandardId, image, isUsingSessionCode, wasmName } = nft;
  const { bottom } = useSafeAreaInsets();
  const navigation = useStackNavigation();
  const updateViewType = useUpdateViewType();
  const updateDisplayType = useUpdateDisplayType();
  const showMessage = useShowMessage();

  const { send, isLoading: isSending } = useSendNFT({
    onError: () => {
      showMessage('NFT sending failed. Please try again later.', MessageType.error);
    },
    onSuccess: () => {
      updateViewType(ViewTypes.HISTORIES);
      navigation.navigate(NFTRouter.NFT_SCREEN);
    },
  });

  const listItems = [
    {
      title: 'Name',
      value: name,
    },
    {
      title: 'Token ID',
      value: `#${tokenId}`,
    },
    {
      title: 'Receiving Address',
      value: receivingAddress,
    },
    {
      title: 'Contract Package Hash',
      value: contractAddress,
    },
    {
      title: 'Token Standard',
      value: getTokenStandardName(tokenStandardId),
    },
    {
      title: 'Transfer Type',
      value: isUsingSessionCode ? DeployTypes.Wasm : DeployTypes.ContractCall,
    },
    {
      title: 'Network Fee',
      value: `${fee} CSPR`,
    },
  ];

  const handleOnConfirm = () => {
    send({
      contractAddress,
      tokenId,
      toPublicKeyHex: receivingAddress,
      tokenStandardId,
      paymentAmount: toMotes(fee),
      name,
      image,
      isUsingSessionCode,
      wasmName,
    });
  };

  const handleOnCancel = () => {
    updateDisplayType(DisplayTypes.ATTRIBUTES);
  };

  return (
    <Col mt={16} style={styles.container}>
      <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.contentContainerStyle}>
        <Col pt={24}>
          {listItems.map((item) => {
            return (
              <View key={`item-${item.title}`}>
                <Text style={styles.caption}>{item.title}</Text>
                <Text style={styles.value} numberOfLines={1} ellipsizeMode={'middle'}>
                  {item.value}
                </Text>
              </View>
            );
          })}
        </Col>
      </ScrollView>
      <View style={styles.footer}>
        <CTextButton
          style={[styles.btn, { marginBottom: bottom + scale(16) }]}
          onPress={handleOnCancel}
          text={'Cancel'}
          type={'line'}
          variant="secondary"
        />
        <CTextButton
          style={[styles.btn, styles.btnSend, { marginBottom: bottom + scale(16) }]}
          text={'Confirm'}
          onPress={handleOnConfirm}
          disabled={isSending}
        />
      </View>
    </Col>
  );
};

export default ConfirmSendNFTScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  contentContainerStyle: {
    paddingHorizontal: scale(16),
  },
  imageWrapper: {
    marginTop: scale(16),
    flexBasis: scale(162),
    alignItems: 'center',
  },
  image: {
    width: scale(160),
    height: scale(160),
  },
  caption: {
    ...textStyles.Sub1,
    color: colors.N3,
  },
  value: {
    ...textStyles.Sub1,
    color: colors.N2,
    marginTop: scale(5),
    marginBottom: scale(16),
    maxWidth: scale(260),
  },
  footer: {
    paddingTop: scale(16),
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnSend: {
    alignSelf: 'center',
  },
  nftImage: {
    width: device.w,
    height: scale(170),
  },
  btn: {
    width: '48%',
  },
});
