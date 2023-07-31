import { colors } from 'assets';
import CRowItem from 'components/CRowItem';
import CTextButton from 'components/CTextButton';
import { scale } from 'device';
import _ from 'lodash';
import React from 'react';
import { View, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle, TouchableOpacity, TextStyle } from 'react-native';
import { AccountInfo } from 'utils/hooks/useAccountInfo';

type Props = {
  logo: ImageSourcePropType;
  account: AccountInfo;
  description: string;
  selectedUid?: string;
  onPress?: () => void;
  onTouch?: () => void;
  buttonText?: string;
  style?: StyleProp<ViewStyle>;
  buttonType?: 'line' | 'default';
  titleStyle?: StyleProp<TextStyle>;
};

const AccountItem = ({
  logo,
  account,
  description,
  onPress,
  buttonText = 'Open',
  onTouch,
  style,
  selectedUid,
  buttonType = 'line',
  titleStyle,
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity disabled={!onTouch} onPress={onTouch}>
        <CRowItem
          title={_.get(account, 'walletInfo.descriptor.name', 'Unknown')}
          description={description}
          logo={logo}
          titleStyle={[titleStyle, selectedUid === account.walletInfo?.uid ? styles.selectedName : undefined]}
        />
      </TouchableOpacity>
      <View>
        <CTextButton
          variant="primary"
          textStyle={styles.buttonTextStyle}
          type={buttonType}
          text={buttonText}
          onPress={onPress}
          style={[styles.button, styles.buttonOutline]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageWrapper: {},
  image: {
    width: scale(40),
    height: scale(40),
  },
  introduction: {
    marginLeft: scale(12),
  },
  name: {
    fontSize: scale(14),
  },
  selectedName: {
    fontWeight: 'bold',
  },
  description: {
    marginTop: scale(6),
    fontSize: scale(11),
    color: colors.c828489,
  },
  button: {
    height: scale(32),
    fontSize: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  buttonTextStyle: {
    fontSize: scale(12),
    minWidth: scale(70),
    textAlign: 'center',
  },
  buttonOutline: {},
});

export default AccountItem;
