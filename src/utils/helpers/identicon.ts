import IdentIcon from 'identicon.js';

/**
 * It takes a value and returns a base64 encoded identicon image
 * @param value - The value to generate the identicon from.
 * @param [options] - {
 * @returns A base64 encoded image of an identicon.
 */
export const getBase64IdentIcon = (value: any, options = {}) => {
  try {
    return `data:image/png;base64,${new IdentIcon(value, {
      background: [255, 0, 0, 0],
      format: 'png',
      ...options,
    }).toString()}`;
  } catch {
    return '/assets/images/token-icon.png';
  }
};
