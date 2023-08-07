import { useSelector } from 'react-redux';
import URL from 'url-parse';

import { getwebUrl } from 'utils/selectors/browser';

import { prefixUrlWithProtocol } from '../utils/url';

export const useCurrentUrl = () => {
  const url = useSelector(getwebUrl);

  if (!url) {
    return { url: '', urlWithProtocol: '' };
  }
  const parsedUrl = new URL(url);
  const urlWithProtocol = parsedUrl?.hostname ? prefixUrlWithProtocol(parsedUrl.hostname) : '';

  return { url, urlWithProtocol };
};
