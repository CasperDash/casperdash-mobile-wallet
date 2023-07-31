import { useCallback, useContext } from 'react';
import BrowserContext from '../context';
import { buildCustomEvent } from '../utils/jsInjector';
import { DAppCustomEvents } from '../enums/events';

export const useSendDAppEvent = () => {
  const browserRef = useContext(BrowserContext);

  const handleOnAccountChange = useCallback(
    (account: { publicKey: string }) => {
      if (!browserRef.current) {
        return;
      }

      const params = {
        isUnlocked: true,
        isConnected: true,
        activeKey: account.publicKey,
      };

      browserRef.current.injectJavaScript(
        buildCustomEvent(DAppCustomEvents.ACTIVE_KEY_CHANGED, JSON.stringify(params)),
      );
    },
    [browserRef],
  );

  const handleOnDisconnected = useCallback(() => {
    if (!browserRef.current) {
      return;
    }

    browserRef.current.injectJavaScript(buildCustomEvent(DAppCustomEvents.DISCONNECTED));
  }, [browserRef]);

  const handleOnConnected = useCallback(
    (publicKey: string) => {
      if (!browserRef.current) {
        return;
      }

      const params = {
        isUnlocked: true,
        isConnected: true,
        activeKey: publicKey,
      };

      browserRef?.current?.injectJavaScript(buildCustomEvent(DAppCustomEvents.CONNECTED, JSON.stringify(params)));
    },
    [browserRef],
  );

  return {
    handleOnAccountChange,
    handleOnDisconnected,
    handleOnConnected,
  };
};
