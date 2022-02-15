import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {Row, Col, CHeader, CLayout} from "components";
import {device, scale} from "device";
import {colors, textStyles} from "assets";
import QRCode from 'react-native-qrcode-svg';
import CTextButton from "components/CTextButton";
import Clipboard from "@react-native-clipboard/clipboard";
import {useDispatch} from "react-redux";
import {MessageType} from "components/CMessge/types";
import {allActions} from "redux_manager";

const ReceiveScreen = () => {

    const publicKey = '02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38'; //TODO: get public key

    const dispatch = useDispatch();

    const onCopy = async () => {
        await Clipboard.setString(publicKey);
        const message = {
            message: 'Copied to Clipboard',
            type: MessageType.success, //TODO: change to type normal
        }
        dispatch(allActions.main.showMessage(message, 1000));
    }

    return (
        <CLayout bgColor={'#f8f8f8'}>
            <CHeader title={'Receive'} style={{backgroundColor: '#f8f8f8'}}/>
            <Col mt={16} style={styles.container}>
                <ScrollView
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <QRCode
                        value={publicKey}
                        size={scale(160)}
                    />
                    <Text style={styles.caption}>Receiving Address</Text>
                    <Text style={styles.title}>{publicKey}</Text>
                    <CTextButton text={'Copy'}
                                 onPress={onCopy}
                                 style={styles.btnCopy}/>
                </ScrollView>
            </Col>

        </CLayout>
    );
};

export default ReceiveScreen;

const styles = StyleSheet.create({
    container: {
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
        backgroundColor: colors.W1,
        flex: 1,
    },
    contentContainerStyle: {
        alignItems: 'center',
        paddingTop: scale(120)
    },
    caption: {
        ...textStyles.Body1,
        color: colors.c828489,
        marginTop: scale(45),
        marginBottom: scale(10)
    },
    title: {
        ...textStyles.Body1,
        paddingHorizontal: scale(16),
        width: scale(375),
        textAlign: 'center'
    },
    btnCopy: {
        marginTop: scale(28)
    }
})
