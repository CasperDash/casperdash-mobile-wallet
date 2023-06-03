import Clipboard from '@react-native-community/clipboard';

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
    await this.setString(string);
    if (this.expireTime) {
      clearTimeout(this.expireTime);
    }
    this.expireTime = setTimeout(async () => {
      const string = await this.getString();

      if (!string) return;

      Clipboard.setString('');
    }, expireTimeMs);
  },
};

export default ClipboardManager;
