import React, { useEffect, useRef, useState } from 'react';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { CHeader, CLayout } from 'components';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Observable } from 'rxjs';
// @ts-ignore
import { Subscription } from 'rxjs/src/internal/Subscription';
import { DeviceItem } from 'screens/authentication/create_new_wallet/components';
import { scale } from 'device';
import { textStyles } from 'assets';
import { GetPublicKeyScreen } from 'screens';
import { Config, Keys } from 'utils';

const deviceAddition = (device: any, devices: any) =>
  devices.some((i: any) => i.id === device.id) ? devices : devices.concat(device);

const ConnectLedgerScreen = () => {
  const subscribe = useRef<any>();
  const [devices, setDevices] = useState<any>([]);
  const [error, setError] = useState<any>();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedDevice, setSelectedDevice] = useState<any>();

  useEffect(() => {
    let previousAvailable = false;
    new Observable(TransportBLE.observeState).subscribe((e: Subscription) => {
      if (e.available !== previousAvailable) {
        previousAvailable = e.available;
        if (e.available) {
          reload();
        }
      }
    });

    startScan();

    return () => {
      subscribe.current?.unsubscribe();
    };
  }, []);

  const startScan = () => {
    setRefreshing(true);
    subscribe.current = new Observable(TransportBLE.listen).subscribe({
      complete: () => {
        setRefreshing(false);
      },
      next: (e: Subscription) => {
        if (e.type === 'add') {
          setRefreshing(false);
          setDevices(deviceAddition(e.descriptor, devices));
        }
      },
      error: (err) => {
        setError(err);
        setRefreshing(false);
      },
    });
  };

  const reload = () => {
    if (subscribe.current) {
      subscribe.current.unsubscribe();
    }
    setDevices([]);
    setError(null);
    setRefreshing(false);
    startScan();
  };

  const onSelect = async (device: any) => {
    try {
      const tp = await TransportBLE.open(device);
      setSelectedDevice(tp.device);
      await Config.saveItem(Keys.ledger, tp.device);
      await tp.close();
    } catch (err) {
      setError(err);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return <DeviceItem device={item} onSelect={onSelect} />;
  };

  const keyExtractor = (item: any) => item.id;

  const ListHeader = () => {
    return error ? (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sorry, an error occured</Text>
        <Text style={styles.errorTitle}>{String(error.message)}</Text>
      </View>
    ) : (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scanning for Bluetooth...</Text>
        <Text style={styles.headerSubtitle}>Power up your Ledger Nano X and enter your pin.</Text>
      </View>
    );
  };

  return (
    <CLayout>
      <CHeader title={'Connect Ledger'} />
      {selectedDevice ? (
        <GetPublicKeyScreen />
      ) : (
        <FlatList
          extraData={error}
          style={styles.list}
          data={devices}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={ListHeader}
          onRefresh={reload}
          refreshing={refreshing}
        />
      )}
    </CLayout>
  );
};

export default ConnectLedgerScreen;

const styles = StyleSheet.create({
  header: {
    paddingTop: scale(80),
    paddingBottom: scale(36),
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: scale(22),
    marginBottom: scale(16),
  },
  headerSubtitle: {
    ...textStyles.H5,
    fontSize: scale(12),
    color: '#999',
  },
  list: {
    flex: 1,
  },
  errorTitle: {
    ...textStyles.Sub1,
    color: '#c00',
    marginBottom: scale(16),
  },
});
