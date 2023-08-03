import { useCallback, useContext } from 'react';
import BrowserContext from '../context';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { normalizeUrl } from '../utils/url';

export const useWebNavigate = () => {
  const browserRef = useContext(BrowserContext);
  const dispatch = useDispatch();

  const go = useCallback(
    (urlToGo: string) => {
      const normalizedUrl = normalizeUrl(urlToGo);

      dispatch(allActions.browser.updatewebUrl(normalizedUrl));
      dispatch(allActions.browser.setDisplayType('browser'));
    },
    [dispatch],
  );

  const goBack = useCallback(() => {
    browserRef.current?.goBack();
  }, [browserRef]);

  const goForward = useCallback(() => {
    browserRef.current?.goForward();
  }, [browserRef]);

  const reload = useCallback(() => {
    browserRef.current?.reload();
  }, [browserRef]);

  return { go, goBack, goForward, reload };
};
