import isUrl from 'is-url';
import URL from 'url-parse';

export const prefixUrlWithProtocol = (url: string, defaultProtocol = 'https://') => {
  const hasProtocol = /^[a-z]*:\/\//.test(url);
  const sanitizedURL = hasProtocol ? url : `${defaultProtocol}${url}`;
  return sanitizedURL;
};

export const normalizeUrl = (input: string, searchEngine = 'DuckDuckGo', defaultProtocol = 'https://') => {
  const regEx = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!&',;=.+]+$/g);
  if (!isUrl(input) && !regEx.test(input)) {
    if (!input.startsWith('http://localhost') && !input.startsWith('localhost')) {
      let searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(input);
      if (searchEngine === 'DuckDuckGo') {
        searchUrl = 'https://duckduckgo.com/?q=' + encodeURIComponent(input);
      }

      return searchUrl;
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
