import { Image, StyleSheet, Text, View } from 'react-native';
import { getBase64IdentIcon } from 'utils/helpers/identicon';
import * as React from 'react';
import { scale } from 'device';
import { colors, textStyles } from 'assets';

type Props = {
  onPress?: () => void;
  publicKey?: string;
  name?: string;
  logo?: string;
  isShowArrow?: boolean;
};

const ValidatorItem = ({ logo, publicKey, name }: Props) => {
  return (
    <View style={styles.selectContent}>
      <View style={styles.iconWrapper}>
        <Image source={{ uri: logo ?? getBase64IdentIcon(publicKey) }} style={styles.icon} />
      </View>
      <View>
        <Text style={styles.nameValidator} numberOfLines={1} ellipsizeMode={'middle'}>
          {name ?? publicKey}
        </Text>
        <Text numberOfLines={1} ellipsizeMode={'middle'} style={[styles.publicKeyValidator]}>
          {publicKey}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectValidator: {
    height: scale(80),
    backgroundColor: colors.N5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(9),
    borderRadius: scale(16),
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameValidator: {
    ...textStyles.Body1,
    color: colors.N2,
    fontSize: scale(16),
    lineHeight: scale(30),
    width: scale(200),
  },
  publicKeyValidator: {
    ...textStyles.Body1,
    color: colors.N3,
    fontSize: scale(16),
    lineHeight: scale(30),
    width: scale(200),
  },
  iconWrapper: {
    flexBasis: scale(50),
  },
  icon: {
    width: scale(36),
    height: scale(36),
  },
});

export default ValidatorItem;
