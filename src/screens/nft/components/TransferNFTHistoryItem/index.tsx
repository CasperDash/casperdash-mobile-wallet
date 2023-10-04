import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';
import { colors, images, textStyles } from 'assets';
import { scale } from 'device';
import { StatusColorMapping } from 'utils/helpers/transaction';
import { NFTHistory } from 'screens/nft/types/nftHistory';
import { toFormattedDate } from 'utils/date';
import { getValueByFormat } from 'utils/helpers/format';

interface Props {
  nftHistory: NFTHistory;
}

const TransferNFTHistoryItem = ({ nftHistory }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={
          nftHistory.image
            ? {
                uri: nftHistory.image,
              }
            : images.nonft
        }
        style={styles.image}
      />
      <View style={styles.row}>
        <View style={styles.rowContent}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode={'middle'}>
            {nftHistory.toPublicKeyHex}
          </Text>
          <Text style={styles.description} numberOfLines={1} ellipsizeMode={'tail'}>
            {nftHistory.timestamp ? toFormattedDate(nftHistory.timestamp) : ''}
          </Text>
        </View>
        <View style={styles.rowFooter}>
          <View style={styles.pendingContainer}>
            <Text style={[styles.status, { color: StatusColorMapping[nftHistory.status] }]}>{nftHistory.status}</Text>
          </View>
          <View>
            <Text style={styles.type}>
              {getValueByFormat(nftHistory.paymentAmount, {
                format: 'mote',
              })}{' '}
              CSPR
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TransferNFTHistoryItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(16),
  },
  title: {
    ...textStyles.Sub1,
    width: scale(130),
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  description: {
    ...textStyles.Body2,
    flex: 1,
  },
  type: {
    ...textStyles.Body1,
    width: scale(130),
  },
  status: {
    ...textStyles.Body2,
    textTransform: 'capitalize',
  },
  btnUnDelegate: {
    width: scale(125),
    height: scale(32),
    marginTop: scale(12),
  },
  textStyle: {
    ...textStyles.Body2,
  },
  rowContent: {
    flex: 1,
  },
  rowFooter: {
    flexBasis: scale(100),
  },
  circle: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(10 / 2),
    backgroundColor: colors.Y1,
    marginRight: scale(8),
  },
  pendingContainer: {
    marginTop: scale(4),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: scale(32),
    height: scale(32),
    resizeMode: 'contain',
    marginRight: scale(8),
  },
});
