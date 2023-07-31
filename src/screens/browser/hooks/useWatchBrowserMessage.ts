import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import { useConnectedSite } from './useConnectedSite';
import { useDisconnectWithAccount } from './useDisconnectWithAccount';
import { useContext } from 'react';
import BrowserContext from '../context';
import { buildRawSender } from '../utils/jsInjector';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

export const useWatchBrowserMessage = () => {
  const dispatch = useDispatch();
  const webRef = useContext(BrowserContext);
  const { connectedSite, urlWithProtocol } = useConnectedSite();

  const { disconnectWithAccount } = useDisconnectWithAccount();

  const handleOnMessage = (event: any) => {
    if (!webRef) {
      throw new Error('webRef is not defined');
    }
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data?.type !== 'casperdash-mobile') {
        return;
      }
      const { payload } = data;
      const publicKey: string = connectedSite?.account?.publicKey || '';

      switch (payload?.methodName) {
        case RequestTypes.GET_ACTIVE_PUBLIC_KEY:
          webRef.current?.injectJavaScript(buildRawSender(RequestTypes.GET_ACTIVE_PUBLIC_KEY, `'${publicKey}'`));
          return;
        case RequestTypes.IS_CONNECTED:
          webRef.current?.injectJavaScript(buildRawSender(RequestTypes.IS_CONNECTED, publicKey ? 'true' : 'false'));
          return;
        case RequestTypes.DISCONNECT:
          disconnectWithAccount(urlWithProtocol, connectedSite?.account?.uid!);
          webRef.current?.injectJavaScript(buildRawSender(RequestTypes.DISCONNECT, 'true'));
          return;
        default:
          if (!Object.values(RequestTypes).includes(payload?.methodName)) {
            return;
          }
          dispatch(
            allActions.browser.setRequestMessage({
              type: payload?.methodName,
              params: payload?.params,
            }),
          );
      }
    } catch (e) {}
  };

  return { handleOnMessage };
};
