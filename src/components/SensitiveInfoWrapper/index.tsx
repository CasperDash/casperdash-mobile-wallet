import React, { FC, useEffect, useState, useRef } from 'react';
import { View, Image, StyleSheet, NativeModules, NativeEventEmitter } from 'react-native';
import { images } from 'assets';
import { AppState } from 'react-native';
// @ts-ignore
import RNScreenshotPrevent, { addListener } from 'react-native-screenshot-prevent';
import Toast from 'react-native-toast-message';

export const SensitiveInfoWrapper: FC<{ children: any }> = ({ children }) => {
  const appState = useRef(AppState.currentState);
  const [isOnBackground, setIsOnBackground] = useState(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState.match(/inactive|background/)) {
        setIsOnBackground(true);
      }
      if (nextAppState === 'active') {
        setIsOnBackground(false);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    RNScreenshotPrevent.enableSecureView();
    const subscription = addListener(() => {
      Toast.show({
        type: 'info',
        text1: 'Screenshots cannot be taken due to security reasons.',
      });
    });

    return () => {
      RNScreenshotPrevent.disableSecureView();
      subscription.remove();
    };
  }, []);

  return isOnBackground ? (
    <View style={styles.container}>
      <Image source={images.logo} style={styles.image} />
    </View>
  ) : (
    children
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
});
