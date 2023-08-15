import React, { forwardRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts, IconBack } from 'assets';
import { device, scale } from 'device';
import { ScreenProps } from 'navigation/ScreenProps';
import AutoHeightWebView from 'react-native-autoheight-webview';

const stylesWebView = `<style>
    img { display: block; max-width: ${device.w - 20}px; height: auto;}
</style>`;

export const Index: React.FC<ScreenProps<'CWebView'>> = ({ route, navigation }, ref) => {
  const insets = useSafeAreaInsets();
  const { url, title, script, content, onMessage } = route.params;
  const [loading, setLoading] = useState(true);
  const goBack = () => {
    navigation.goBack();
  };

  const onLoadEnd = () => {
    setLoading(false);
  };

  const _renderLoading = () => {
    return (
      <View style={styles.indicator}>
        <ActivityIndicator size={30} />
      </View>
    );
  };

  const htmlContent = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0">${stylesWebView}</head><body>${content} <div style="height: 5px"/></body></html>`;

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
            onPress={goBack}
            style={styles.btnBack}
          >
            <IconBack width={scale(25)} height={scale(25)} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {loading ? 'Index...' : title}
            </Text>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: scale(100),
          }}
        >
          <AutoHeightWebView
            ref={ref}
            onLoadEnd={onLoadEnd}
            injectedJavaScript={script}
            onMessage={onMessage}
            startInLoadingState={true}
            source={url ? { uri: url } : content ? { baseUrl: '', html: htmlContent } : undefined}
            scrollEnabled={false}
            renderLoading={_renderLoading}
            style={{ width: device.w - scale(30), alignSelf: 'center' }}
          />
        </ScrollView>
      </View>
    </>
  );
};

export default forwardRef(Index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cFFFFFF,
  },
  headerContainer: {
    width: '100%',
    height: scale(48),
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: scale(16),

    borderBottomWidth: 0.4,
    borderColor: '#e7e7e7',
  },
  btnBack: {
    position: 'absolute',
    left: scale(16),
    top: scale(11),
    zIndex: 10,
  },
  headerRight: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: scale(30),
  },
  headerTitle: {
    width: '100%',
    marginLeft: scale(-30),
    textAlign: 'center',
    fontWeight: '500',
    fontSize: scale(20),
    lineHeight: scale(28),
    fontFamily: fonts.Poppins.regular,
  },
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
