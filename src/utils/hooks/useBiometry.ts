import { useEffect, useState } from 'react';
import { Config, Keys } from 'utils';
import TouchID from 'react-native-touch-id';

export enum BiometryType {
  FaceID = 'FaceID',
  TouchId = 'TouchId',
}

const optionalConfigObject = {
  unifiedErrors: true,
  passcodeFallback: true, // if true is passed, itwill allow isSupported to return an error if the device is not enrolled in touch id/face id etc. Otherwise, it will just tell you what method is supported, even if the user is not enrolled.  (default false)
};

const useBiometry = () => {
  const [isBiometryEnabled, setIsBiometryEnabled] = useState<boolean>(false);
  const [biometryType, setBiometryType] = useState<BiometryType | undefined>();

  useEffect(() => {
    Config.getItem(Keys.touchIdEnabled).then(isEnabled =>
      setIsBiometryEnabled(isEnabled),
    );
    TouchID.isSupported(optionalConfigObject)
      .then(type => {
        // Success code
        if (type === BiometryType.FaceID) {
          setBiometryType(BiometryType.FaceID);
        } else {
          setBiometryType(BiometryType.TouchId);
        }
      })
      .catch(() => {
        setBiometryType(undefined);
      });
  }, []);

  const onUpdateBiometryStatus = async (isEnabled: boolean) => {
    if (!isEnabled) {
      setIsBiometryEnabled(false);
      await Config.saveItem(Keys.touchIdEnabled, false);
    } else {
      await TouchID.authenticate('To login', optionalConfigObject)
        .then(async () => {
          setIsBiometryEnabled(true);
          await Config.saveItem(Keys.touchIdEnabled, true);
        })
        .catch(() => {
          Config.alertMess({
            message: 'Authentication Failed',
          });
        });
    }
  };

  return { isBiometryEnabled, biometryType, onUpdateBiometryStatus };
};

export default useBiometry;
