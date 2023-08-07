import Toast from 'react-native-toast-message';

import ClipboardManager from 'utils/helpers/clipboard';

export const copyToClipboard = async (value: string, expire?: boolean) => {
  if (expire) {
    await ClipboardManager.setStringExpire(value);
  } else {
    await ClipboardManager.setString(value);
  }

  Toast.show({
    type: 'success',
    text1: 'Copied to Clipboard',
    text2: expire ? '(for 1 minute)' : '',
    visibilityTime: 2000,
  });
};
