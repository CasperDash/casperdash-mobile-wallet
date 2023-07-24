import React from 'react';
import { colors, textStyles } from 'assets';
import { scale } from 'device';
import { View, Text, Dimensions, Linking, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNews } from 'utils/hooks/useNews';
import Carousel from 'react-native-reanimated-carousel';
import { Col } from 'components';

export const News = () => {
  const { data } = useNews();
  const width = Dimensions.get('window').width;

  const onPress = async (url?: string) => {
    if (!url) {
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };
  return (
    <Col style={{ backgroundColor: colors.cF8F8F8 }}>
      <Text style={styles.title}>News</Text>
      <Carousel
        loop
        autoPlay
        data={data || []}
        width={width}
        height={scale(300)}
        scrollAnimationDuration={2000}
        autoPlayInterval={5000}
        mode="parallax"
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => onPress(item.url)} style={{ display: 'flex', alignItems: 'center' }}>
              <Image
                source={{ uri: item?.bannerUrl }}
                style={{ width: width, height: scale(200), marginBottom: scale(24), borderRadius: scale(8) }}
              />
              <View style={styles.itemContainer}>
                <View style={styles.badgeContainer}>
                  <Text style={styles.badge}>{item.label}</Text>
                </View>
                <Text style={styles.newsTitle}>{item?.title}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </Col>
  );
};

const styles = StyleSheet.create({
  itemContainer: { display: 'flex', flexDirection: 'row', paddingBottom: scale(8), alignItems: 'flex-start' },
  badgeContainer: {
    paddingHorizontal: scale(4),
    paddingVertical: scale(2),
    borderRadius: scale(4),
    backgroundColor: colors.R1,
    marginRight: scale(4),
  },
  badge: {
    color: colors.W1,
    fontWeight: '700',
    fontSize: scale(11),
    borderWidth: 0,
  },
  newsTitle: {
    fontWeight: '700',
    width: scale(300),
  },
  title: {
    ...textStyles.Sub1,
    color: colors.N3,
    marginLeft: scale(16),
    marginTop: scale(24),
  },
});
