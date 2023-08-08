import Clipboard from '@react-native-clipboard/clipboard';
import { isIos } from 'device';

export const EXPIRE_CLIPBOARD_TIME_MS = 60000;

const ClipboardManager = {
  async getString() {
    return await Clipboard.getString();
  },
  async setString(string: string) {
    Clipboard.setString(string);
  },
  expireTime: null as any,
  async setStringExpire(string: string, expireTimeMs = EXPIRE_CLIPBOARD_TIME_MS) {
    if (isIos()) {
      // @ts-ignore
      await Clipboard.setStringExpire(string);
    } else {
      await this.setString(string);
      if (this.expireTime) {
        clearTimeout(this.expireTime);
      }
      this.expireTime = setTimeout(async () => {
        const cString = await this.getString();

        if (!cString) return;

        Clipboard.setString('');
      }, expireTimeMs);
    }
  },
};

export default ClipboardManager;
