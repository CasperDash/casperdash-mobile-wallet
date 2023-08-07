import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet, Image } from 'react-native';

import Carousel from 'react-native-reanimated-carousel';

import { colors, textStyles } from 'assets';
import { Col } from 'components';
import { scale } from 'device';
import { useNavigateSimpleWebView } from 'utils/hooks/useNavigateSimpleWebView';
import { useNews } from 'utils/hooks/useNews';

export const News = () => {
  const { data } = useNews();
  const { navigateToWebView } = useNavigateSimpleWebView();
  const width = Dimensions.get('window').width;

  const onPress = async (url?: string, title?: string) => {
    if (!url) {
      return;
    }
    navigateToWebView({
      url,
      title,
    });
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
            <TouchableOpacity
              onPress={() => onPress(item.url, item.title)}
              style={{ display: 'flex', alignItems: 'center' }}
            >
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
