import { Dimensions, Platform } from 'react-native';

import { hasNotch } from 'react-native-device-info';

const width = 375;

const screen = Dimensions.get('screen');

let device = {
  w: Dimensions.get('window').width,
  h: Dimensions.get('window').height,
  width: width,
  s: Dimensions.get('window').width / width,
};

const scale = (size: number) => {
  return Math.round(size * device.s);
};

const isIos = () => {
  return Platform.OS === 'ios' || Platform.OS === 'macos';
};

const isNavigationTab = () => {
  return isIos() && hasNotch();
};

const NAVIGATION_TAB = scale(34);

const NAVIGATION_TAB_ANDROID = screen.height - device.h;

const PADDING_HORIZONTAL = scale(16);

const HEADER_HEIGHT = scale(56);

export {
  device,
  scale,
  isIos,
  isNavigationTab,
  NAVIGATION_TAB,
  PADDING_HORIZONTAL,
  NAVIGATION_TAB_ANDROID,
  HEADER_HEIGHT,
};
