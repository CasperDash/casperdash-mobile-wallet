import { Image } from '@rneui/base';
import { colors } from 'assets';
import { scale } from 'device';
import React from 'react';
import { View, Text, StyleSheet, ImageSourcePropType, StyleProp, ViewStyle, TextStyle } from 'react-native';

type Props = {
  logo: ImageSourcePropType;
  description: string;
  title?: string;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

const CRowItem = ({ logo, description, title, style, titleStyle }: Props) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.imageWrapper}>
        <Image source={logo} style={styles.image} />
      </View>
      <View style={styles.introduction}>
        <Text style={[styles.name, titleStyle]}>{title}</Text>
        <Text style={[styles.description]}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  description: {
    marginTop: scale(6),
    fontSize: scale(11),
    color: colors.c828489,
  },
});

export default CRowItem;
