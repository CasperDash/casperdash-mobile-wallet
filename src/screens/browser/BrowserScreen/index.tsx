import { colors } from 'assets';
import { CLayout } from 'components';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';

import BrowserContext from '../context';
import BrowserHeadBar from '../components/BrowserHeadBar';
import DAppWebView from '../components/DAppWebView';
import { getDisplayType } from 'utils/selectors/browser';
import HomePageContent from '../components/HomePageContent';
import { scale } from 'device';
import { allActions } from 'redux_manager';
import ModalRequestAction from '../components/ModalRequestAction';

const BrowserScreen = () => {
  const displayType = useSelector(getDisplayType);
  const webRef = useRef<WebView>(null!);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(allActions.browser.loadConnectedSites());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CLayout edges={['top', 'left', 'right']} bgColor={colors.cF8F8F8} statusBgColor={colors.cF8F8F8}>
      <View style={styles.container}>
        <BrowserContext.Provider value={webRef}>
          <View style={styles.head}>
            <BrowserHeadBar />
          </View>
          <View style={styles.content}>
            {displayType === 'homepage' ? (
              <View style={styles.homePage}>
                <HomePageContent />
              </View>
            ) : (
              <View style={[styles.browser]}>
                <DAppWebView ref={webRef} />
                <ModalRequestAction />
              </View>
            )}
          </View>
        </BrowserContext.Provider>
      </View>
    </CLayout>
  );
};

export default BrowserScreen;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  homePage: {
    flex: 1,
    marginTop: scale(20),
    paddingTop: scale(24),
    paddingHorizontal: scale(16),
    backgroundColor: colors.cFFFFFF,
    borderTopRightRadius: scale(40),
    borderTopLeftRadius: scale(40),
  },
  head: {},
  content: {
    marginTop: scale(4),
    flex: 1,
  },
  browser: {
    flex: 1,
  },
  modal: {
    backgroundColor: colors.c000000,
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 0,
    backgroundColor: 'white',
  },
  input: {},
});
