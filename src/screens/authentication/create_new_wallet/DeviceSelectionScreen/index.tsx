import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Platform, PermissionsAndroid, FlatList, StyleSheet} from 'react-native';
import {Observable} from 'rxjs';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
// @ts-ignore
import {Subscription} from 'rxjs/src/internal/Subscription';
import {CLayout} from 'components';
import {DeviceItem} from 'screens/authentication/create_new_wallet/components';
import {scale} from 'device';
import {textStyles} from 'assets';

const deviceAddition = (device: any) => ({devices}: any) => ({
    devices: devices.some((i: any) => i.id === device.id) ? devices : devices.concat(device),
});

interface Props {
    onSelectDevice: (device: any) => void
}

const DeviceSelectionScreen = ({onSelectDevice}: Props) => {

    const subscribe = useRef<any>();
    const [devices, setDevices] = useState<any>([]);
    const [error, setError] = useState<any>();
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        async function androidPermissions() {
            await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            );
        }

        if (Platform.OS === 'android') {
            androidPermissions();
        }

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
                    setDevices(deviceAddition(e.descriptor));
                }
            },
            error: error => {
                setError(error);
                setRefreshing(false);
            },
        });
    };

    const reload = () => {
        if (subscribe.current) {subscribe.current.unsubscribe();}
        setDevices([]);
        setError(null);
        setRefreshing(false);
        startScan();
    };

    const onSelect = async (device: any) => {
        try {
            await onSelectDevice(device);
        } catch (error) {
            setError(error);
        }
    };

    const renderItem = ({item}: { item: any }) => {
        return <DeviceItem device={item} onSelect={onSelect}/>;
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
                <Text style={styles.headerSubtitle}>
                    Power up your Ledger Nano X and enter your pin.
                </Text>
            </View>
        );
    };

    return (
        <CLayout>
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
        </CLayout>
    );
};

export default DeviceSelectionScreen;

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
