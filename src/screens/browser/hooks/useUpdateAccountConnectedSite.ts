import { useCallback, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConnectedSites } from 'utils/selectors/browser';
import { allActions } from 'redux_manager';
import { WalletInfo } from 'react-native-casper-storage';
import { useSendDAppEvent } from './useSendDAppEvent';
import BrowserContext from '../context';

export const useUpdateAccountConnectedSite = () => {
  const connectedSites = useSelector(getConnectedSites);
  const dispatch = useDispatch();
  const { handleOnAccountChange } = useSendDAppEvent();
  const browserRef = useContext(BrowserContext);

  const updateAccountConnectedSite = useCallback(
    (origin: string, { publicKey, uid, walletInfo }: { publicKey: string; uid: string; walletInfo?: WalletInfo }) => {
      const { account } = connectedSites[origin];
      dispatch(
        allActions.browser.updateConnectedSites({
          ...connectedSites,
          [origin]: {
            ...connectedSites[origin],
            account: {
              publicKey,
              uid,
              walletInfo,
            },
          },
        }),
      );

      if (account?.publicKey !== publicKey) {
        handleOnAccountChange({
          publicKey,
        });
        browserRef.current?.reload();
      }
    },
    [browserRef, connectedSites, dispatch, handleOnAccountChange],
  );

  return {
    updateAccountConnectedSite,
  };
};
