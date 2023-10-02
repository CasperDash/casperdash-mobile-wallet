import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import { MessageType } from 'components/CMessge/types';
import { useGetDApps } from 'utils/hooks/useGetDApps';
import { getHostnameWithoutWWW } from '../utils/url';
import { useConfigurations } from 'utils/hooks/useConfigurations';

export const useWatchUnvalidDomainWarning = (domainUrl: string) => {
  const [isValid, setIsValid] = useState(true);
  const dispatch = useDispatch();
  const { data: dApps = [] } = useGetDApps();
  const { data: configurations } = useConfigurations();

  const showMessage = useCallback((message: string, type?: string) => {
    const messages = {
      message: message,
      type: type ?? MessageType.normal,
    };
    dispatch(allActions.main.showMessage(messages, 3000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (domainUrl) {
      const hostname = getHostnameWithoutWWW(domainUrl);
      const isValidDomain = configurations?.DAPP_WHITELIST_DOMAINS.some((domain) => {
        return hostname === domain;
      });

      const isValidDApp = dApps.some((dApp) => {
        return hostname === getHostnameWithoutWWW(dApp.url);
      });

      setIsValid(isValidDomain || isValidDApp);
    }
  }, [domainUrl, showMessage, dApps, configurations?.DAPP_WHITELIST_DOMAINS]);

  return {
    isValid,
  };
};
