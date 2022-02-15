import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {CButton, CHeader, CInput, CLayout, Col, Row} from "components";
import {colors, textStyles, IconArrowDown} from "assets";
import {scale} from "device";

function SendScreen() {
    return (
        <CLayout bgColor={'#f8f8f8'}>
            <CHeader title={'Send'} style={{backgroundColor: '#f8f8f8'}}/>
            <Col mt={16} style={styles.container}>
                <ScrollView contentContainerStyle={styles.contentContainerStyle}>
                    <Text style={styles.title}>Asset</Text>
                    <CButton>
                        <Row.LR px={16} style={styles.rowPicker}>
                            <Text style={textStyles.Body1}>CSPR</Text>
                            <Row.C>
                                <Text style={textStyles.Sub1}>6.7394</Text>
                                <View style={styles.verticalLine}/>
                                <IconArrowDown width={scale(10)} height={scale(6)}/>
                            </Row.C>
                        </Row.LR>
                    </CButton>
                    <Text style={styles.title}>Transfer Amount</Text>
                    <CInput
                        inputStyle={styles.inputStyle}
                        containerStyle={styles.rowPicker}/>
                    <Text style={styles.title}>Receiving Address</Text>
                    <CInput
                        inputStyle={styles.inputStyle}
                        placeholder={'Enter receiving address'}
                        containerStyle={styles.rowPicker}/>
                    <Text style={styles.title}>Transfer ID (optional)</Text>
                    <CInput
                        inputStyle={styles.inputStyle}
                        placeholder={'Enter note'}
                        containerStyle={styles.rowPicker}/>
                    <Text style={[styles.title, {marginBottom: scale(8)}]}>Network Fee</Text>
                    <Text style={[styles.title, {marginTop: 0}, textStyles.Body1]}>0.1 CSPR</Text>
                </ScrollView>
            </Col>
        </CLayout>
    );
}

export default SendScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: colors.W1,
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
    },
    contentContainerStyle: {
        paddingHorizontal: scale(16),
    },
    title: {
        ...textStyles.Sub1,
        color: colors.N3,
        marginTop: scale(24),
        marginBottom: scale(16)
    },
    rowPicker: {
        width: scale(343),
        height: scale(48),
        backgroundColor: colors.N5,
        borderRadius: scale(16),
        borderWidth: 0
    },
    verticalLine: {
        width: scale(1),
        marginHorizontal: scale(8),
        height: scale(30),
        backgroundColor: colors.N4
    },
    inputStyle: {
        ...textStyles.Sub1,

    }
})
