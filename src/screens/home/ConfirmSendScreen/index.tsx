import React from 'react';
import {CLayout, Col, CHeader} from 'components';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {colors, textStyles} from 'assets';
import {scale} from 'device';
import CTextButton from 'components/CTextButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function ConfirmSendScreen() {

    const {bottom} = useSafeAreaInsets();

    return (
        <CLayout
            edges={['right', 'top', 'left']}
            bgColor={'#f8f8f8'}>
            <CHeader title={'Confirm'} style={{backgroundColor: '#f8f8f8'}}/>
            <Col mt={16} style={styles.container}>
                <ScrollView
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Col pt={24}>
                        <Text style={styles.caption}>Asset</Text>
                        <Text style={styles.value}>CSPR</Text>
                        <Text style={styles.caption}>Transfer Amount</Text>
                        <Text style={styles.value}>12 ($1.08)</Text>
                        <Text style={styles.caption}>Network Fee</Text>
                        <Text style={styles.value}>0.1 CSPR</Text>
                        <Text style={styles.caption}>Receiving Address</Text>
                        <Text
                            style={styles.value}>02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38</Text>
                        <Text style={styles.caption}>Transfer ID</Text>
                        <Text style={styles.value}>123321321</Text>
                    </Col>
                </ScrollView>
                <CTextButton
                    style={[styles.btnSend, {marginBottom: bottom + scale(10)}]}
                    text={'Send'}/>
            </Col>
        </CLayout>
    );
}

export default ConfirmSendScreen;

const styles = StyleSheet.create({
    caption: {
        ...textStyles.Sub1,
        color: colors.N3,
    },
    value: {
        ...textStyles.Sub1,
        color: colors.N2,
        marginTop: scale(5),
        marginBottom: scale(16),
    },
    btnSend: {
        alignSelf: 'center',
    },
    container: {
        width: scale(375),
        flex: 1,
        backgroundColor: colors.W1,
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
    },
    contentContainerStyle: {
        paddingHorizontal: scale(16),
    },
});
