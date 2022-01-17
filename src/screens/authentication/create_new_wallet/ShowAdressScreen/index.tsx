import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import AppEth from '@ledgerhq/hw-app-eth';
import QRCode from 'react-native-qrcode-svg';
import {scale} from 'device';
import {textStyles} from 'assets';

const delay = (ms: number) => new Promise(success => setTimeout(success, ms));

interface Props {
    transport: any
}

const ShowAddressScreen = ({transport}: Props) => {
    const [error, setError] = useState<any>();
    const [address, setAddress] = useState<any>(null);
    const unmountRef = useRef<boolean>(false);

    useEffect(() => {
        while (!address) {
            if (unmountRef.current) {
                return;
            }
            fetchAddress(false);
            delay(500);
        }
        fetchAddress(true);

        return () => {
            unmountRef.current = true;
        };
    }, []);

    const fetchAddress = async (verify: boolean) => {
        try {
            const eth = new AppEth(transport);
            const path = "44'/60'/0'/0/0"; // HD derivation path
            const {address} = await eth.getAddress(path, verify);
            if (unmountRef.current) {
                return;
            }
            setAddress(address);
        } catch (error) {
            // in this case, user is likely not on Ethereum app
            if (unmountRef.current) {
                return;
            }
            setError(error);
            return null;
        }
    };

    return (
        <View style={styles.ShowAddressScreen}>
            {!address ? (
                <>
                    <Text style={styles.loading}>Loading your Ethereum address...</Text>
                    {error ? (
                        <Text style={styles.error}>
                            A problem occurred, make sure to open the Ethereum application
                            on your Ledger Nano X. (
                            {String((error && error.message) || error)})
                        </Text>
                    ) : null}
                </>
            ) : (
                <>
                    <Text style={styles.title}>Ledger Live Ethereum Account</Text>
                    <QRCode value={address} size={300}/>
                    <Text style={styles.address}>{address}</Text>
                </>
            )}
        </View>
    );
};

export default ShowAddressScreen;

const styles = StyleSheet.create({
    ShowAddressScreen: {
        flex: 1,
        padding: scale(16),
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        ...textStyles.Sub1,
        color: '#c00',
        marginBottom: scale(16),
    },
    loading: {
        ...textStyles.Sub1,
        color: '#999',
        fontSize: scale(16),
    },
    title: {
        ...textStyles.H5,
        fontSize: scale(22),
        marginBottom: scale(16),
    },
    address: {
        marginTop: scale(16),
        color: '#555',
        fontSize: scale(14),
    },
});
