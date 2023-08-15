import { useSelector } from 'react-redux';
import { getwebUrl } from 'utils/selectors/browser';
import { prefixUrlWithProtocol } from '../utils/url';
import URL from 'url-parse';

export const useCurrentUrl = () => {
  const url = useSelector(getwebUrl);

  if (!url) {
    return { url: '', urlWithProtocol: '' };
  }
  const parsedUrl = new URL(url);
  const urlWithProtocol = parsedUrl?.hostname ? prefixUrlWithProtocol(parsedUrl.hostname) : '';

  return { url, urlWithProtocol };
};
