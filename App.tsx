import 'react-native-gesture-handler';
import React from 'react';
import { AppNavigation } from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux_manager';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import 'react-native-console-time-polyfill';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './src/components/ErrorFallback';
import { toastError } from './src/utils/helpers/errorHandler';
import * as Sentry from '@sentry/react-native';
import APP_CONFIGS from './src/utils/config/index';

Sentry.init({
  dsn: APP_CONFIGS.SENTRY_DSN,
  debug: __DEV__,
  environment: __DEV__ ? 'development' : 'production',
});

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any) => {
      toastError(err);
      Sentry.captureMessage('API Error!!!');
    },
  }),
});

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

export default Sentry.wrap(App);
