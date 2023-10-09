import { useCallback } from 'react';
import { useGetDApps } from 'utils/hooks/useGetDApps';
import { getHostnameWithoutWWW } from '../utils/url';
import { useConfigurations } from 'utils/hooks/useConfigurations';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';

export const useValidDomainUrl = () => {
  const { data: dApps = [] } = useGetDApps();
  const dispatch = useDispatch();
  const { data: configurations } = useConfigurations();

  const validUrl = useCallback(
    (domainUrl: string) => {
      if (domainUrl) {
        const hostname = getHostnameWithoutWWW(domainUrl);
        const isValidDomain = configurations?.DAPP_WHITELIST_DOMAINS.some((domain) => {
          return hostname === domain;
        });

        const isValidDApp = dApps.some((dApp) => {
          return hostname === getHostnameWithoutWWW(dApp.url);
        });

        const isValid = isValidDomain || isValidDApp;

        dispatch(allActions.browser.setIsShowWarningDomain(!isValid));

        return isValid;
      }
    },
    [configurations?.DAPP_WHITELIST_DOMAINS, dApps, dispatch],
  );

  return {
    validUrl,
  };
};
