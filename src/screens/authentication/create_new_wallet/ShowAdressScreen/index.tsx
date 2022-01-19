import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import AppEth from '@ledgerhq/hw-app-eth';
import QRCode from 'react-native-qrcode-svg';
import {scale} from 'device';
import {textStyles} from 'assets';
import {useDispatch} from 'react-redux';
import {allActions} from 'redux_manager';
import {Config} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import CreateNewWalletRouter from 'navigation/CreateNewWalletNavigation/CreateNewWalletRouter';
import {CLoading} from 'components';

const delay = (ms: number) => new Promise(success => setTimeout(success, ms));

interface Props {
    transport: any
}

const ShowAddressScreen = ({transport}: Props) => {
    const [error, setError] = useState<any>();
    const [address, setAddress] = useState<any>(null);
    const [isLoading, setLoading] = useState<boolean>(false);

    const unmountRef = useRef<boolean>(false);
    const dispatch = useDispatch();
    const {replace} = useNavigation<StackNavigationProp<any>>();

    useEffect(() => {
        setupFetchAddress();
        return () => {
            unmountRef.current = true;
        };
    }, []);

    const setupFetchAddress = async () => {
        while (!address) {
            if (unmountRef.current) {
                return;
            }
            await fetchAddress(false);
            await delay(700);
        }
        await fetchAddress(true);
    };

    const fetchAddress = async (verify: boolean) => {
        try {
            const eth = new AppEth(transport);
            const path = "44'/60'/0'/0/0"; // HD derivation path
            const {address, publicKey} = await eth.getAddress(path, verify);
            if (unmountRef.current) {
                return;
            }
            if (address && publicKey) {
                unmountRef.current = true;
                setAddress(address);
                getAccountInformation(publicKey);
            }
        } catch (err) {
            if (unmountRef.current) {
                return;
            }
            setError(err);
            return null;
        }
    };

    const getAccountInformation = (publicKey: string) => {
        setLoading(true);
        dispatch(allActions.user.getAccountInformation(publicKey, async (err: any, data: any) => {
            if (data) {
                const info = {
                    publicKey: publicKey,
                    loginOptions: {
                        connectionType: 'ledger',
                    },
                    data: data,
                };
                await Config.saveItem('casperdash', info);
                setLoading(false);
                replace(CreateNewWalletRouter.CHOOSE_PIN_SCREEN, {publicKey});
            } else {
                setLoading(false);
                Config.alertMess(err);
            }
        }));
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
            {isLoading && <CLoading/>}
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
