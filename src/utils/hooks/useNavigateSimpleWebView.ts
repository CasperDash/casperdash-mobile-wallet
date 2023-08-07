import { useCallback } from 'react';

import { useNavigation } from '@react-navigation/native';

import MainRouter from 'navigation/stack/MainRouter';
import { toastError } from 'utils/helpers/errorHandler';

type Params = {
  url?: string;
  title?: string;
};

export const useNavigateSimpleWebView = () => {
  const navigation = useNavigation();
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
