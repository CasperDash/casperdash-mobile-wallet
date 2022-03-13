import IdentIcon from 'identicon.js';

export const getBase64IdentIcon = (value, options = {}) => {
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
