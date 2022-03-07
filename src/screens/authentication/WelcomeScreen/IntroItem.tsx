import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Intro } from 'screens/authentication/data/data';
import { scale } from 'device';
import { colors, textStyles } from 'assets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const introDescription =
  'Casper Dash is a platform that aims to build a new creative economy.';

const IntroItem = (data: Intro) => {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <View style={styles.introContainer}>
      <Image
        style={[styles.introImage, { marginTop: -(top + bottom + scale(20)) }]}
        source={data.image}
      />
      <Text style={styles.title}>{data.title}</Text>
      <Text style={styles.body2}>{introDescription}</Text>
    </View>
  );
};

export default IntroItem;

const styles = StyleSheet.create({
  introContainer: {
    width: scale(375),
    justifyContent: 'center',
    alignItems: 'center',
  },
  introImage: {
    width: scale(250),
    height: scale(250),
    resizeMode: 'contain',
  },
  title: {
    ...textStyles.H3,
    color: colors.N2,
    textAlign: 'center',
  },
  body2: {
    ...textStyles.Body2,
    color: colors.N3,
    textAlign: 'center',
    marginTop: scale(16),
    width: scale(375 - 64),
    alignSelf: 'center',
    lineHeight: 26,
  },
});
