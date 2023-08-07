import { useCallback, useContext } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { allActions } from 'redux_manager';
import { getLoadingProgress } from 'utils/selectors/browser';

import BrowserContext from '../context';

export const useLoadingProgress = () => {
  const dispatch = useDispatch();
  const webRef = useContext(BrowserContext);
  const loadingProgress = useSelector(getLoadingProgress);

  const cancelLoading = useCallback(() => {
    webRef.current?.stopLoading();
    dispatch(allActions.browser.setLoadingProgress(0));
  }, [dispatch, webRef]);

  return {
    progress: loadingProgress,
    isLoading: loadingProgress && loadingProgress > 0 && loadingProgress < 1,
    cancel: cancelLoading,
  };
};
