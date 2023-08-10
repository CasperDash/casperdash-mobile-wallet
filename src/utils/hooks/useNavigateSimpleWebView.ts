import MainRouter from 'navigation/stack/MainRouter';
import { useCallback } from 'react';
import { toastError } from 'utils/helpers/errorHandler';
import { useStackNavigation } from './useNavigation';

type Params = {
  url?: string;
  title?: string;
};

export const useNavigateSimpleWebView = () => {
  const navigation = useStackNavigation();
  const navigateToWebView = useCallback(
    ({ url, title = '' }: Params) => {
      if (!url) {
        toastError('URL is not defined');
        return;
      }

      return navigation.navigate(MainRouter.SIMPLE_WEBVIEW_SCREEN, { url, title });
    },
    [navigation],
  );

  return {
    navigateToWebView,
  };
};
