import 'react-native-gesture-handler';
import React from 'react';
import { AppNavigation } from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux_manager';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from 'react-query';
import 'react-native-console-time-polyfill';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './src/components/ErrorFallback';

// Create a client
const queryClient = new QueryClient();

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppNavigation />
            <Toast />
          </ErrorBoundary>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
