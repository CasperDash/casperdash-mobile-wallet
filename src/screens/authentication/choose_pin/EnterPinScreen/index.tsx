import React, { useCallback, useEffect, useState } from 'react';
import { CLayout, CButton } from 'components';
import { Image, StyleSheet, Text, NativeModules } from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import PinCodeWrapper from '../PinCodeWrapper';
import { images, colors, textStyles } from 'assets';
import useBiometry, { BiometryType } from 'utils/hooks/useBiometry';
import { scale } from 'device';
import { validatePin } from 'utils/helpers/account';
import { Keys, Config } from 'utils';

const MAX_ATTEMPT = 5;

const EnterPinScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { isBiometryEnabled, biometryType } = useBiometry();
  const [pin, setPin] = useState<string>();
  const [storedPin, setStoredPin] = useState<string>();
  const [isBiometry, setIsBiometry] = useState<boolean>(false);

  useEffect(() => {
    Config.getItem(Keys.masterPassword).then(masterPassword => {
      setStoredPin(masterPassword);
    });
  }, []);

  const onFinishedEnterPin = () => {
    navigation.navigate(AuthenticationRouter.INIT_ACCOUNT_SCREEN, {
      isLoadUser: true,
      pin,
    });
  };

  const onValidatePin = async (pinCode: string) => {
    if (pinCode || isBiometry) {
      setPin(pinCode);
      return await validatePin(pinCode, isBiometry);
    }
    return false;
  };

  const onDeleteAllData = () => {
    Object.entries(Keys).map(key => {
      return Config.deleteItem(key[1]);
    });
    NativeModules.DevSettings.reload();
  };

  const touchIdButton = useCallback(
    (launchTouchID: () => void) => {
      return (
        <>
          {biometryType && isBiometryEnabled && (
            <CButton
              onPress={() => {
                setIsBiometry(true);
                launchTouchID();
              }}>
              <Image
                style={{
                  marginLeft: scale(16),
                  width: scale(40),
                  height: scale(40),
                }}
                source={
                  biometryType === BiometryType.FaceID
                    ? images.faceId
                    : images.touchId
                }
              />
            </CButton>
          )}
        </>
      );
    },
    [biometryType, isBiometryEnabled],
  );

  return (
    <CLayout>
      <PinCodeWrapper
        status="enter"
        finishProcess={onFinishedEnterPin}
        timeLocked={__DEV__ ? 20000 : undefined}
        maxAttempts={MAX_ATTEMPT}
        delayBetweenAttempts={1000}
        bottomLeftComponent={touchIdButton}
        handleResultEnterPin={onValidatePin}
        storedPin={storedPin}
      />
      {__DEV__ && (
        <CButton onPress={onDeleteAllData} style={styles.btnDelete}>
          <Text style={styles.txtDelete}>Delete All Data</Text>
        </CButton>
      )}
    </CLayout>
  );
};

export default EnterPinScreen;

const styles = StyleSheet.create({
  btnDelete: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(16),
    minWidth: scale(134),
    height: scale(36),
    borderRadius: scale(18),
    borderWidth: scale(1),
    borderColor: colors.N4,
    alignSelf: 'center',
    marginTop: scale(70),
  },
  txtDelete: {
    ...textStyles.Body2,
  },
});
