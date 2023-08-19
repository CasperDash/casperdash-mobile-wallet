import { Image } from '@rneui/base';
import { colors, textStyles } from 'assets';
import CTextButton from 'components/CTextButton';
import { scale } from 'device';
import React from 'react';
import { View, Text, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';

type Props = {
  logo: ImageSourcePropType;
  name: string;
  description: string;
  onPress?: () => void;
  buttonText?: string;
  style: StyleProp<ViewStyle>;
};

const CRowItemButton = ({ style, logo, name, description, onPress, buttonText = 'Open' }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <View style={styles.imageWrapper}>
          <Image source={logo} style={styles.image} />
        </View>
        <View style={styles.introduction}>
          <Text style={styles.name}>{name}</Text>
          <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.description]}>
            {description}
          </Text>
        </View>
      </View>
      <View>
        <CTextButton
          textStyle={styles.buttonTextStyle}
          type="line"
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {},
  image: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(16),
  },
  introduction: {
    marginLeft: scale(12),
    justifyContent: 'space-between',
  },
  name: {
    fontSize: scale(14),
  },
  description: {
    marginTop: scale(6),
    fontSize: scale(11),
    color: colors.c828489,
    maxWidth: scale(170),
  },
  button: {
    height: scale(32),
    fontSize: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
  },
  buttonTextStyle: {
    ...textStyles.Body2,
    fontSize: scale(12),
  },
  buttonOutline: {},
});

export default CRowItemButton;
