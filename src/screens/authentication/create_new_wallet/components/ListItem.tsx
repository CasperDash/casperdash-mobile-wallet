import React from 'react';
import {Text, StyleSheet, Platform, Linking} from 'react-native';
import {CreateNewWalletMenu} from 'screens/authentication/data/data';
import {Row, CButton} from 'components';
import {scale} from 'device';
import {colors, fonts} from 'assets';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import {Config} from 'utils';
import {PERMISSIONS, requestMultiple} from 'react-native-permissions';

interface ListItemProps {
    onPress: (screen: string) => void,
    data: CreateNewWalletMenu
}

function ListItem({data, onPress}: ListItemProps) {
    const Icon = data.icon;

    const checkPermissions = async () => {
        const message = 'CasperDash is requesting permission to turn on Bluetooth. Allow?';
        if (data.screen === CreateNewWalletRouter.CONNECT_LEDGER_SCREEN) {
            if (Platform.OS === 'ios' && parseInt(Platform.Version, 10) > 12) {
                Config.requestPermission(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL, {message}, navigate);
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
                    ['granted', 'unavailable'].includes(status[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT]) &&
                    ['granted', 'unavailable'].includes(status[PERMISSIONS.ANDROID.BLUETOOTH_SCAN]) &&
                    ['granted', 'unavailable'].includes(status[PERMISSIONS.ANDROID.BLUETOOTH_ADVERTISE])
                ) {
                    navigate();
                } else {
                    Config.alertMess({message}, {submit: 'Allow', cancel: 'Cancel'}, () => {
                        Linking.openSettings();
                    }, () => {
                        return;
                    });
                }
            }
            return;
        }
        navigate();
    };

    const navigate = () => {
        onPress(data.screen);
    };

    return (
        <CButton onPress={checkPermissions}>
            <Row px={20} mb={16} style={styles.container}>
                <Icon/>
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
