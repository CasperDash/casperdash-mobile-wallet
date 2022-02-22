import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AppEth from '@ledgerhq/hw-app-eth';
import {scale} from 'device';
import {textStyles} from 'assets';
import {useDispatch} from 'react-redux';
import {allActions} from 'redux_manager';
import {Config} from 'utils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import Keys from 'utils/keys';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';

const delay = (ms: number) => new Promise(success => setTimeout(success, ms));

interface Props {
    transport: any,
    setTransport: (transport: any) => void
}

const GetPublicKeyScreen = ({transport, setTransport}: Props) => {
    const [error, setError] = useState<any>();
    const [publicKey, setPublicKey] = useState<any>(null);

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
        while (!publicKey) {
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
            const address = await eth.getAddress(path, verify);
            if (unmountRef.current) {
                return;
            }
            if (address && address.publicKey) {
                setError(null);
                setPublicKey(address.publicKey);
                unmountRef.current = true;
                getAccountInformation(address.publicKey);
            }
            else {
                setTransport(null);
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
        dispatch(allActions.user.getAccountInformation({publicKey}, async (err: any, data: any) => {
            if (data) {
                const ledger = await Config.getItem(Keys.ledger);
                const info = {
                    publicKey: publicKey,
                    loginOptions: {
                        connectionType: 'ledger',
                        device: ledger && ledger.device || {},
                    },
                };
                await Config.saveItem(Keys.casperdash, info);
                replace(AuthenticationRouter.CHOOSE_PIN);
            } else {
                setTransport(null);
                Config.alertMess(err);
            }
        }));
    };

    return (
        <View style={styles.ShowAddressScreen}>
            {!error && <Text style={styles.loading}>Loading your account</Text>}
            {
                !publicKey && error &&
                <Text style={styles.error}>
                    A problem occurred, make sure to open the Ethereum application
                    on your Ledger Nano X. (
                    {String((error && error.message) || error)})
                </Text>
            }
        </View>
    );
};

export default GetPublicKeyScreen;

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
