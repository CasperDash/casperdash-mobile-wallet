import 'react-native-gesture-handler';
import React from 'react';
import { AppNavigation } from 'navigation';
import { Provider } from 'react-redux';
import { store } from 'redux_manager';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppNavigation />
        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;
