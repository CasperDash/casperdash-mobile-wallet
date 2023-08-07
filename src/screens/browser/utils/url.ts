import isUrl from 'is-url';
import URL from 'url-parse';

import { SearchEngines } from '../enums/searchEngines';

export const prefixUrlWithProtocol = (url: string, defaultProtocol = 'https://') => {
  const hasProtocol = /^[a-z]*:\/\//.test(url);
  const sanitizedURL = hasProtocol ? url : `${defaultProtocol}${url}`;
  return sanitizedURL;
};

export const normalizeUrl = (
  input: string,
  searchEngine: SearchEngines = SearchEngines.DUCK_DUCK_GO,
  defaultProtocol = 'https://',
) => {
  //NOSONAR
  const regEx = new RegExp(
    /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$/g,
  );
  if (!isUrl(input) && !regEx.test(input)) {
    if (!input.startsWith('http://localhost') && !input.startsWith('localhost')) {
      return searchEngine + encodeURIComponent(input);
    }
  }
  return prefixUrlWithProtocol(input, defaultProtocol);
};

export const sanitizeUrlInput = (url: string) => url.replace(/'/g, '%27').replace(/[\r\n]/g, '');

export const getUrlWithProtocol = (url: string) => {
  if (!url) {
    return '';
  }
  const parsedUrl = new URL(url);
  if (!parsedUrl) {
    return '';
  }

  const urlWithProtocol = parsedUrl?.hostname ? prefixUrlWithProtocol(parsedUrl.hostname) : '';

  return urlWithProtocol;
};

export const compareUrls = (url1: string, url2: string) => {
  const parsedUrl1 = new URL(url1);
  const parsedUrl2 = new URL(url2);

  return parsedUrl1?.hostname === parsedUrl2?.hostname;
};
