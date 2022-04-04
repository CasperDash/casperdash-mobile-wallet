import React from 'react';
import { Text, StyleSheet, Platform, Linking } from 'react-native';
import { CreateNewWalletMenu } from 'screens/authentication/data/data';
import { Row, CButton } from 'components';
import { scale } from 'device';
import { colors, fonts } from 'assets';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import { Config } from 'utils';
import { PERMISSIONS, requestMultiple } from 'react-native-permissions';
import AndroidOpenSettings from 'react-native-android-open-settings';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

interface ListItemProps {
  onPress: (screen: string) => void;
  data: CreateNewWalletMenu;
}

function ListItem({ data, onPress }: ListItemProps) {
  const Icon = data.icon;

  const goToBluetoothSettings = () =>
    Platform.OS === 'ios'
      ? Linking.openURL('App-Prefs:Bluetooth')
      : AndroidOpenSettings.bluetoothSettings();

  const checkPermissions = async () => {
    if (data.screen === CreateNewWalletRouter.CONNECT_LEDGER_SCREEN) {
      const bluetoothState = await BluetoothStateManager.getState();
      switch (bluetoothState) {
        case 'Unsupported':
        case 'Unknown':
          Config.alertMess({
            message: 'Bluetooth is not available on this device',
          });
          break;
        case 'Unauthorized':
        case 'PoweredOn':
          await requestPermission();
          break;
        default:
          Config.alertMess(
            { message: 'Please turn on Bluetooth to continue' },
            { submit: 'Go to Settings', cancel: 'Cancel' },
            goToBluetoothSettings,
            () => {
              return;
            },
          );
          break;
      }
      return;
    }
    navigate();
  };

  const navigate = () => {
    onPress(data.screen);
  };

  const requestPermission = async () => {
    const message =
      'CasperDash is requesting permission to turn on Bluetooth. Allow?';
    if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 12) {
      Config.requestPermission(
        PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
        { message },
        navigate,
      );
    }
    if (Platform.OS === 'android') {
      const status = await requestMultiple([
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE,
      ]);
      if (
        status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] === 'granted' &&
        ['granted', 'unavailable'].includes(
          status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT],
        ) &&
        ['granted', 'unavailable'].includes(
          status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN],
        ) &&
        ['granted', 'unavailable'].includes(
          status[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE],
        )
      ) {
        navigate();
      } else {
        Config.alertMess(
          { message },
          { submit: 'Allow', cancel: 'Cancel' },
          () => {
            Linking.openSettings();
          },
          () => {
            return;
          },
        );
      }
    }
  };

  return (
    <CButton onPress={checkPermissions}>
      <Row px={20} mb={16} style={styles.container}>
        <Icon />
        <Text style={styles.title}>{data.title}</Text>
      </Row>
    </CButton>
  );
}

export default ListItem;

const styles = StyleSheet.create({
  container: {
    width: scale(327),
    height: scale(64),
    borderRadius: scale(32),
    borderWidth: scale(1),
    borderColor: colors.gray6,
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.Lato.regular,
    fontWeight: '400',
    fontSize: scale(17),
    fontStyle: 'normal',
    color: colors.N2,
    marginLeft: scale(20),
  },
});
