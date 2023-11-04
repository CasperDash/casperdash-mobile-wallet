import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { allActions } from 'redux_manager';
import { getConnectedSites } from 'utils/selectors/browser';
import { buildRawSender } from '../utils/jsInjector';
import BrowserContext from '../context';
import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import { useSendDAppEvent } from './useSendDAppEvent';
import { IAccountInfo } from 'utils/hooks/useAccountInfo';

export const useConnectWithAccount = () => {
  const dispatch = useDispatch();
  const connectedSites = useSelector(getConnectedSites);
  const browserRef = useContext(BrowserContext);
  const { handleOnAccountChange, handleOnConnected } = useSendDAppEvent();

  const connectWithAccount = useCallback(
    async (urlWithProtocol: string, accountInfo?: IAccountInfo) => {
      if (!accountInfo) {
        throw new Error('Wallet info is required');
      }

      const { publicKey, walletInfo } = accountInfo;

      if (connectedSites?.[urlWithProtocol]) {
        const { account } = connectedSites[urlWithProtocol];
        if (account?.publicKey && publicKey !== account?.publicKey) {
          handleOnAccountChange({
            publicKey,
          });
          browserRef.current?.reload();
        }

        dispatch(
          allActions.browser.updateConnectedSites({
            ...connectedSites,
            [urlWithProtocol]: {
              ...connectedSites[urlWithProtocol],
              account: accountInfo,
              connectedUids: [...connectedSites[urlWithProtocol].connectedUids, walletInfo.uid],
            },
          }),
        );
      } else {
        dispatch(
          allActions.browser.updateConnectedSites({
            ...(connectedSites || {}),
            [urlWithProtocol]: {
              ...(connectedSites?.[urlWithProtocol] || []),
              account: {
                publicKey: publicKey,
                uid: walletInfo.uid,
                walletInfo,
              },
              connectedUids: [walletInfo.uid],
            },
          }),
        );
      }

      setTimeout(() => {
        browserRef?.current?.injectJavaScript(buildRawSender(RequestTypes.CONNECT, 'true'));
      }, 100);
      handleOnConnected(publicKey);
    },
    [browserRef, connectedSites, dispatch, handleOnAccountChange, handleOnConnected],
  );

  return {
    connectWithAccount,
  };
};
