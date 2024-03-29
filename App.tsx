import 'react-native-gesture-handler';
import React from 'react';
import { AppNavigation } from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux_manager';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';
import 'react-native-console-time-polyfill';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './src/components/ErrorFallback';
import { toastError } from './src/utils/helpers/errorHandler';
import * as Sentry from '@sentry/react-native';
import APP_CONFIGS from './src/utils/config/index';
import DeviceInfo from 'react-native-device-info';
import { CustomError } from './src/utils/constants/requestKeys';
import { ToastMessage } from './src/components/Toast';

Sentry.init({
  dsn: APP_CONFIGS.SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  release: `io.casperdash.casperwallet@${DeviceInfo.getVersion()}`,
  dist: DeviceInfo.getBuildNumber(),
});

// Create a client
const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (err: any) => {
      toastError(err?.message || err);
      if (!Object.values(CustomError).includes(err?.name)) {
        Sentry.captureMessage('API Error!!!');
      }
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <AppNavigation />
            <ToastMessage />
          </ErrorBoundary>
        </SafeAreaProvider>
      </QueryClientProvider>
    </Provider>
  );
};

export default Sentry.wrap(App);
