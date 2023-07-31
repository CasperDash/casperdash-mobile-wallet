import { useDispatch, useSelector } from 'react-redux';
import { getConnectedSites } from 'utils/selectors/browser';
import { useCallback } from 'react';
import { allActions } from 'redux_manager';
import { ConnectedSiteParams } from 'redux_manager/browser/browser_reducer';
import { getPublicKeyCache } from 'utils/helpers/account';
import { useSendDAppEvent } from './useSendDAppEvent';

type Params = {
  onDisconnectSite?: () => void;
};

export const useDisconnectWithAccount = ({ onDisconnectSite }: Params = {}) => {
  const dispatch = useDispatch();
  const connectedSites: Record<string, ConnectedSiteParams> = useSelector(getConnectedSites);
  const { handleOnDisconnected } = useSendDAppEvent();

  const disconnectWithAccount = useCallback(
    async (urlWithProtocol: string, uid: string) => {
      if (connectedSites[urlWithProtocol]) {
        const filteredConnectedUids = connectedSites[urlWithProtocol].connectedUids.filter(
          (item: string) => item !== uid,
        );
        if (filteredConnectedUids.length === 0) {
          dispatch(
            allActions.browser.updateConnectedSites({
              ...connectedSites,
              [urlWithProtocol]: {
                ...connectedSites[urlWithProtocol],
                account: {
                  publicKey: '',
                  uid: '',
                },
                connectedUids: filteredConnectedUids,
              },
            }),
          );

          handleOnDisconnected();
          onDisconnectSite?.();
          return;
        }

        let { account } = connectedSites[urlWithProtocol];
        if (account?.uid === uid) {
          const firstUid = filteredConnectedUids[0];
          account = {
            publicKey: await getPublicKeyCache(firstUid),
            uid: firstUid,
          };
        }

        return dispatch(
          allActions.browser.updateConnectedSites({
            ...connectedSites,
            [urlWithProtocol]: {
              ...connectedSites[urlWithProtocol],
              account,
              connectedUids: filteredConnectedUids,
            },
          }),
        );
      }
    },
    [connectedSites, dispatch, handleOnDisconnected, onDisconnectSite],
  );

  return {
    disconnectWithAccount,
  };
};
