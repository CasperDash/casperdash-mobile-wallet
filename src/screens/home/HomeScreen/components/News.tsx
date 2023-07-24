import React from 'react';
import { colors, IconList } from 'assets';
import { scale } from 'device';
import { View, Text, Dimensions, SafeAreaView, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import { useNews } from 'utils/hooks/useNews';
import Carousel from 'react-native-reanimated-carousel';
import { useNavigation } from '@react-navigation/native';
import MarketRouter from 'navigation/MarketNavigation/MarketRouter';

export const News = () => {
  const { data } = useNews();
  const width = Dimensions.get('window').width;
  const { navigate } = useNavigation();

  const onPress = async (url?: string) => {
    if (!url) {
      return;
    }
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const onPressMore = () => {
    navigate('Market', { screen: MarketRouter.MARKET_SCREEN });
  };

  return (
    <SafeAreaView>
      <Carousel
        loop
        autoPlay
        data={data || []}
        height={scale(30)}
        scrollAnimationDuration={2000}
        autoPlayInterval={5000}
        vertical
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => onPress(item.url)} style={styles.itemContainer}>
              <View style={styles.badgeContainer}>
                <Text style={styles.badge}>{item.label}</Text>
              </View>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {item?.title}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity style={styles.moreIcon} onPress={onPressMore}>
        <IconList />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    display: 'flex',
    flexDirection: 'row',
    paddingLeft: scale(24),
    paddingBottom: scale(8),
    width: scale(284),
  },
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
  title: {
    fontWeight: '700',
  },
  moreIcon: {
    position: 'absolute',
    right: scale(24),
  },
});
