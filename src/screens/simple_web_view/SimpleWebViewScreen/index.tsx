import React, { useState } from 'react';
import * as RNProgress from 'react-native-progress';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import { IconCloseAlt, IconShare, colors } from 'assets';
import { CLayout } from 'components';
import { scale } from 'device';
import { ScreenProps } from 'navigation/ScreenProps';
import share from 'react-native-share';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import { WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import Animated, { useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type Props = ScreenProps<'SIMPLE_WEB_VIEW'>;

const SimpleWebViewScreen = ({ route }: Props) => {
  const { goBack } = useStackNavigation();
  const [progress, setProgress] = useState(0);
  const { url, title } = route.params;

  const handleOnClosePress = () => {
    goBack();
  };

  const handleOnSharePress = async () => {
    try {
      await share.open({
        url,
      });
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleOnLoadProgress = ({ nativeEvent }: WebViewProgressEvent) => {
    setProgress(nativeEvent.progress);
  };

  const reanimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(progress === 1 ? 0 : 1, { duration: 1000, easing: Easing.ease }),
    };
  }, [progress]);

  return (
    <CLayout bgColor={colors.cF8F8F8} edges={['top', 'left', 'right']} statusBgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <View>
          <View style={styles.navBar}>
            <View style={styles.closeWrapper}>
              <TouchableOpacity onPress={handleOnClosePress}>
                <IconCloseAlt width={scale(22)} height={scale(22)} />
              </TouchableOpacity>
            </View>
            <View style={styles.titleWrapper}>
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
                {title}
              </Text>
            </View>
            <View style={styles.shareWrapper}>
              <TouchableOpacity onPress={handleOnSharePress}>
                <IconShare width={scale(22)} height={scale(22)} color={colors.c000000} />
              </TouchableOpacity>
            </View>
          </View>
          <Animated.View
            style={reanimatedStyle}
            key={'simple-web-view-progress-bar'}
          >
            <RNProgress.Bar
              width={null}
              height={scale(2)}
              progress={progress}
              borderRadius={0}
              borderWidth={0}
              useNativeDriver
            />
          </Animated.View>
        </View>
        <WebView
          originWhitelist={['*']}
          source={{
            uri: url,
          }}
          onLoadProgress={handleOnLoadProgress}
        />
      </View>
    </CLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navBar: {
    height: scale(50),
    borderBottomColor: colors.cE0E0E0,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    justifyContent: 'space-between',
  },
  closeWrapper: {
    flexBasis: scale(30),
  },
  shareWrapper: {
    flexBasis: scale(30),
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  titleWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
});
export default SimpleWebViewScreen;
