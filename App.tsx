import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { YellowBox } from 'react-native';
import { AppNavigation } from 'navigation';
import { Provider } from 'react-redux';
import { store } from 'redux_manager';
import Toast from 'react-native-toast-message';
import SplashScreen from 'react-native-splash-screen';

import CodePush from 'react-native-code-push';

const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME,
};
let App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <Provider store={store}>
      <AppNavigation />
      <Toast ref={ref => Toast.setRef(ref)} />
    </Provider>
  );
};

export default CodePush(CODE_PUSH_OPTIONS)(App);
