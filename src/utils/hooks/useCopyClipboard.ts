import ClipboardManager from 'utils/helpers/clipboard';
import Toast from 'react-native-toast-message';

export const copyToClipboard = async (value: string, expire?: boolean) => {
  expire ? await ClipboardManager.setStringExpire(value) : ClipboardManager.setString(value);
  Toast.show({
    type: 'success',
    text1: 'Copied to Clipboard',
    text2: expire ? '(for 1 minute)' : '',
    visibilityTime: 2000,
  });
};
