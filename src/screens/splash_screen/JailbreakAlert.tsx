import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Text, StyleSheet, BackHandler } from 'react-native';
import { colors, fonts } from 'assets';
import Splash from 'react-native-splash-screen';
import JailMonkey from 'jail-monkey';
import { CAlert } from 'components';
import { isIos, scale } from 'device';

interface JailbreakAlertProps {
  onFinish: () => void;
}

export const JailbreakAlert: FC<JailbreakAlertProps> = ({ onFinish }) => {
  const alertRef = useRef<any>();
  const ios = isIos();
  const [isJailbroken, setIsJailbroken] = React.useState<boolean | undefined>(undefined);
  const [isDebuggedMode, setIsDebuggedMode] = React.useState<boolean | undefined>(undefined);
  const [isHookDetected, setIsHookDetected] = React.useState<boolean | undefined>(undefined);

  const onJailbrokenDetected = useCallback(() => {
    Splash.hide();
    const alert = {
      showConfirm: false,
      showCancel: false,
      alertMessage: (
        <>
          <Text style={styles.title}>{`Device ${ios ? 'Jailbreak' : 'Root'}  Detected`}</Text>
          <Text style={styles.message}>
            Please note that your device appears to be{' '}
            <Text style={styles.importantMessage}>{ios ? 'jailbroken' : 'rooted'}</Text>. Using our application on a
            modified device may pose potential <Text style={styles.importantMessage}> security risks</Text>, including
            the loss of your crypto assets. We recommend using our app on a{' '}
            <Text style={styles.importantMessage}>{`${ios ? 'non-jailbroken' : 'non-rooted'} device`}</Text> for optimal
            security.
          </Text>
        </>
      ),
    };
    alertRef.current.show(alert);
  }, [ios]);

  const onCloseApp = () => {
    BackHandler.exitApp();
  };

  const onDebugDetect = useCallback(() => {
    const alert = {
      showConfirm: false,
      showCancel: false,
      alertMessage: (
        <>
          <Text style={styles.title}>{`App Debugging Detected`}</Text>
          <Text style={styles.message}>
            We have detected that the app is currently being debugged. Debugging can compromise the security and
            stability of the application. For security reasons, we do not allow the app to be used while debugging is
            active.
          </Text>
          <Text style={styles.message}>Please ensure that debugging is turned off before using the app.</Text>
        </>
      ),
    };
    alertRef.current.show(alert);
  }, []);

  const onHookDetect = useCallback(() => {
    const alert = {
      showConfirm: false,
      showCancel: false,
      alertMessage: (
        <>
          <Text style={styles.title}>{`Suspicious Applications Detected`}</Text>
          <Text style={styles.message}>
            We have detected the presence of certain suspicious applications on your device. These applications may pose
            potential security risks to your device and compromise the integrity of our app.
          </Text>
          <Text style={styles.message}>
            For your safety, we recommend uninstalling any suspicious applications before using our app.
          </Text>
        </>
      ),
    };
    alertRef.current.show(alert);
  }, []);

  useEffect(() => {
    setIsJailbroken(JailMonkey.isJailBroken());
    setIsHookDetected(JailMonkey.hookDetected());
    JailMonkey.isDebuggedMode().then((isDbMode) => setIsDebuggedMode(isDbMode));
  }, []);

  useEffect(() => {
    // should wait for all checks completed
    if (isDebuggedMode === undefined || isHookDetected === undefined || isJailbroken === undefined) {
      return;
    }
    if (isDebuggedMode) {
      onDebugDetect();
      return;
    }
    if (isHookDetected) {
      onHookDetect();
      return;
    }
    if (isJailbroken) {
      onJailbrokenDetected();
      return;
    }

    onFinish();
  }, [onFinish, onJailbrokenDetected, onHookDetect, onDebugDetect, isJailbroken, isHookDetected, isDebuggedMode]);

  return (
    <CAlert
      ref={alertRef}
      hideClose
      onCancel={onCloseApp}
      buttonConfirmStyle={styles.confirmButton}
      buttonCancelStyle={{ width: scale(100) }}
      hideOnClickOutside={false}
    />
  );
};

const styles = StyleSheet.create({
  message: {
    textAlign: 'center',
    fontSize: scale(16),
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  importantMessage: {
    color: colors.R1,
    fontSize: scale(16),
    fontFamily: fonts.Lato.regular,
    fontWeight: '600',
  },
  title: {
    color: colors.R1,
    fontWeight: '800',
    fontSize: scale(20),
    textAlign: 'center',
    marginBottom: scale(20),
  },
  confirmButton: { width: 'auto', alignSelf: 'center' },
});
