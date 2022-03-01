import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {colors, IconCopy, textStyles} from 'assets';
import {CButton, CHeader, CLayout, Col, Row} from 'components';
import {ScreenProps} from 'navigation/ScreenProps';
import MainRouter from 'navigation/stack/MainRouter';
import {scale} from 'device';

// @ts-ignore
const TransferHistoryScreen: React.FC<ScreenProps<MainRouter.TRANSFER_HISTORY_SCREEN>> = ({route}) => {
    const {deploy} = route.params;
    const {symbol} = deploy;

    return (
        <CLayout bgColor={colors.cF8F8F8}
                 edges={['right', 'top', 'left']}
                 statusBgColor={colors.cF8F8F8}>
            <CHeader title={'Send CSRP'} style={{backgroundColor: colors.cF8F8F8}}/>
            <Col mt={16} style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{marginTop: scale(24)}}
                    contentContainerStyle={styles.contentContainerStyle}>
                    <Text style={[styles.title, {marginTop: 0}]}>Sending Address</Text>
                    <CButton>
                        <Row style={styles.row}>
                            <Text numberOfLines={1}
                                  ellipsizeMode={'middle'}
                                  style={[styles.value, {width: scale(200)}]}>02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38</Text>
                            <IconCopy style={styles.icCopy} width={scale(15)} height={scale(15)}/>
                        </Row>
                    </CButton>
                    <Text style={styles.title}>Receiving Address</Text>
                    <CButton>
                        <Row style={styles.row}>
                            <Text numberOfLines={1}
                                  ellipsizeMode={'middle'}
                                  style={[styles.value, {width: scale(200)}]}>02021172744b5e6bdc83a591b75765712e068e5d40a3be8ae360274fb26503b4ad38</Text>
                            <IconCopy style={styles.icCopy} width={scale(15)} height={scale(15)}/>
                        </Row>
                    </CButton>
                    <Text style={styles.title}>Network Fee</Text>
                    <Text style={styles.value}>0.00022203 <Text
                        style={[textStyles.Body1, {fontWeight: '500'}]}>CSPR</Text></Text>
                    <Text style={styles.title}>Transaction Time</Text>
                    <Text style={styles.value}>2021-10-19 22:30</Text>
                    <Text style={styles.title}>Transaction Hash</Text>
                    <CButton>
                        <Row style={styles.row}>
                            <Text style={styles.value}>0xhf797vbco98948nous98c999wrbiosiijdid9wffosf9skcjaf89fcsoch 879b </Text>
                            <IconCopy style={styles.icCopy} width={scale(15)} height={scale(15)}/>
                        </Row>
                    </CButton>
                    <Text style={styles.title}>Transfer ID</Text>
                    <Text style={styles.value}>0474938757539385</Text>
                </ScrollView>
            </Col>
        </CLayout>
    );
};

export default TransferHistoryScreen;

const styles = StyleSheet.create({
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
    title: {
        ...textStyles.Sub1,
        color: colors.N3,
        marginTop: scale(20),
    },
    value: {
        ...textStyles.Body1,
        marginTop: scale(12),
        paddingRight: scale(20),
        maxWidth: scale(375 - 32 - 20),
    },
    row: {
        width: scale(375 - 16 * 2),
        alignItems: 'center',
    },
    icCopy: {
        marginTop: scale(10),
    },
});
