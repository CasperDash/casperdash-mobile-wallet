import { useCallback, useContext } from 'react';
import { WalletInfo } from 'react-native-casper-storage';
import { useDispatch, useSelector } from 'react-redux';
import { allActions } from 'redux_manager';
import { getPublicKeyCache } from 'utils/helpers/account';
import { getConnectedSites } from 'utils/selectors/browser';
import { buildRawSender } from '../utils/jsInjector';
import BrowserContext from '../context';
import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import { useSendDAppEvent } from './useSendDAppEvent';

export const useConnectWithAccount = () => {
  const dispatch = useDispatch();
  const connectedSites = useSelector(getConnectedSites);
  const browserRef = useContext(BrowserContext);
  const { handleOnAccountChange, handleOnConnected } = useSendDAppEvent();

  const connectWithAccount = useCallback(
    async (urlWithProtocol: string, walletInfo?: WalletInfo) => {
      if (!walletInfo) {
        throw new Error('Wallet info is required');
      }

      const { uid } = walletInfo;
      const publicKey = await getPublicKeyCache(uid);

      if (connectedSites && connectedSites[urlWithProtocol]) {
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
              account: {
                publicKey: publicKey,
                uid,
                walletInfo,
              },
              connectedUids: [...connectedSites[urlWithProtocol].connectedUids, uid],
            },
          }),
        );
      } else {
        dispatch(
          allActions.browser.updateConnectedSites({
            ...connectedSites,
            [urlWithProtocol]: {
              ...connectedSites[urlWithProtocol],
              account: {
                publicKey: publicKey,
                uid,
                walletInfo,
              },
              connectedUids: [uid],
            },
          }),
        );
      }

      browserRef?.current?.injectJavaScript(buildRawSender(RequestTypes.CONNECT, 'true'));
      handleOnConnected(publicKey);
    },
    [browserRef, connectedSites, dispatch, handleOnAccountChange, handleOnConnected],
  );

  return {
    connectWithAccount,
  };
};
