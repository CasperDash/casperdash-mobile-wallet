import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getConnectedSites } from 'utils/selectors/browser';
import { useCurrentUrl } from './useCurrentUrl';

export const useConnectedSite = () => {
  const connectedSites = useSelector(getConnectedSites);
  const { urlWithProtocol } = useCurrentUrl();

  const connectedSite = useMemo(() => {
    if (!connectedSites) {
      return null;
    }
    return connectedSites[urlWithProtocol];
  }, [connectedSites, urlWithProtocol]);

  const isConnected = useMemo(() => {
    return !!connectedSite?.connectedUids?.length;
  }, [connectedSite]);

  return {
    urlWithProtocol,
    connectedSite,
    isConnected,
  };
};
