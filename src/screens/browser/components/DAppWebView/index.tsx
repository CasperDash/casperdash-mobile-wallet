import { IconArrowBack, IconArrowForward, IconMenuHome, colors } from 'assets';
import { CButton } from 'components';
import { isIos, scale } from 'device';
import React, { forwardRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import WebView from 'react-native-webview';
import {
  ShouldStartLoadRequest,
  WebViewErrorEvent,
  WebViewNavigationEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { useDispatch, useSelector } from 'react-redux';
import { allActions } from 'redux_manager';
import { useWatchBrowserMessage } from 'screens/browser/hooks/useWatchBrowserMessage';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';
import { web3Script } from 'screens/browser/scripts/web3';
import { buildDebugConsole } from 'screens/browser/utils/jsInjector';
import { getwebUrl } from 'utils/selectors';

type Props = {};

const DAppWebView = (_props: Props, webRef: any) => {
  const webUrl = useSelector(getwebUrl);
  const dispatch = useDispatch();
  const [isCanForward, setIsCanForward] = useState(false);
  const [isCanBack, setIsCanBack] = useState(false);
  const { goForward, goBack } = useWebNavigate();

  const { handleOnMessage } = useWatchBrowserMessage();

  const handleOnError = ({ nativeEvent }: WebViewErrorEvent) => {
    console.log('handleOnError: ', nativeEvent);
  };

  const handleOnShouldStartLoadWithRequest = (event: ShouldStartLoadRequest) => {
    setIsCanBack(event.canGoBack);
    setIsCanForward(event.canGoForward);

    return true;
  };

  const handleOnForwardPress = () => {
    goForward();
  };

  const handleOnBackPress = () => {
    goBack();
  };

  const handleOnLoadStart = ({ nativeEvent }: WebViewNavigationEvent) => {
    dispatch(allActions.browser.updatewebUrl(nativeEvent.url));
  };

  const handleOnLoad = ({ nativeEvent }: WebViewNavigationEvent) => {
    if (isIos()) {
      dispatch(allActions.browser.updatewebUrl(nativeEvent.url));
    }
    setIsCanBack(nativeEvent.canGoBack);
    setIsCanForward(nativeEvent.canGoForward);
  };

  const handleOnLoadProgress = ({ nativeEvent }: WebViewProgressEvent) => {
    dispatch(allActions.browser.setLoadingProgress(nativeEvent.progress || 0));
  };

  const handleOnLoadEnd = ({ nativeEvent }: WebViewNavigationEvent | WebViewErrorEvent) => {
    if (nativeEvent.loading) {
      return;
    }
    setIsCanBack(nativeEvent.canGoBack);
    setIsCanForward(nativeEvent.canGoForward);

    if (__DEV__) {
      webRef.current.injectJavaScript(buildDebugConsole());
    }
  };

  const handleOnHomePress = () => {
    dispatch(allActions.browser.updatewebUrl(''));
    dispatch(allActions.browser.setDisplayType('homepage'));
    dispatch(allActions.browser.setLoadingProgress(0));
  };

  return (
    <View style={styles.container}>
      <View style={styles.webViewWrapper}>
        <WebView
          ref={webRef}
          originWhitelist={['*']}
          source={{
            uri: webUrl,
          }}
          style={styles.browser}
          injectedJavaScriptBeforeContentLoaded={web3Script}
          onMessage={handleOnMessage}
          automaticallyAdjustContentInsets
          javaScriptEnabled
          allowsInlineMediaPlayback
          domStorageEnabled
          onError={handleOnError}
          useWebkit
          onShouldStartLoadWithRequest={handleOnShouldStartLoadWithRequest}
          onLoadStart={handleOnLoadStart}
          onLoad={handleOnLoad}
          onLoadProgress={handleOnLoadProgress}
          onLoadEnd={handleOnLoadEnd}
          applicationNameForUserAgent={'WebView CasperDashMobile'}
          setSupportMultipleWindows={false}
        />
      </View>
      <View style={styles.footer}>
        <View style={styles.actions}>
          <CButton disabled={!isCanBack} onPress={handleOnBackPress}>
            <IconArrowBack style={styles.arrowButton} width={scale(16)} height={scale(16)} />
          </CButton>
          <CButton disabled={!isCanForward} onPress={handleOnForwardPress}>
            <IconArrowForward style={styles.arrowButton} width={scale(16)} height={scale(16)} />
          </CButton>
          <View>
            <TouchableOpacity onPress={handleOnHomePress}>
              <IconMenuHome width={scale(16)} height={scale(16)} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

DAppWebView.displayName = 'DAppWebView';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewWrapper: {
    flex: 1,
  },
  browser: {
    flex: 1,
    height: scale(1000),
  },
  input: {},
  actions: {
    display: 'flex',
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-around',
  },
  arrowButton: {
    color: colors.c000000,
  },
  arrowBack: {},
  arrowForward: {},
  footer: {
    justifyContent: 'center',
    marginTop: scale(16),
    paddingBottom: scale(20),
  },
});

export default forwardRef(DAppWebView);
