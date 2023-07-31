import { useDispatch, useSelector } from 'react-redux';
import { getConnectedSites } from 'utils/selectors/browser';
import { useCallback, useContext } from 'react';
import { allActions } from 'redux_manager';
import { ConnectedSiteParams } from 'redux_manager/browser/browser_reducer';
import { useSendDAppEvent } from './useSendDAppEvent';
import BrowserContext from '../context';

export const useDisconnectAllAccounts = () => {
  const dispatch = useDispatch();
  const browserRef = useContext(BrowserContext);
  const connectedSites: Record<string, ConnectedSiteParams> = useSelector(getConnectedSites);
  const { handleOnDisconnected } = useSendDAppEvent();

  const disconnectAllAccounts = useCallback(
    (urlWithProtocol: string) => {
      dispatch(
        allActions.browser.updateConnectedSites({
          ...connectedSites,
          [urlWithProtocol]: {
            ...connectedSites[urlWithProtocol],
            account: {
              publicKey: '',
              uid: '',
            },
            connectedUids: [],
          },
        }),
      );

      browserRef.current?.reload();
      handleOnDisconnected();
    },
    [browserRef, connectedSites, dispatch, handleOnDisconnected],
  );

  return {
    disconnectAllAccounts,
  };
};
