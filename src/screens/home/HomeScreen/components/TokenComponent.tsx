import React, {useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {scale} from "device";
import {Row, Col} from 'components';
import {colors, images, textStyles} from "assets";

const TokenComponent = () => {
    return (
        <Row.LR mx={16} style={styles.container}>
            <Row>
                <Image source={images.symbol_cspr}
                       style={styles.symbol}
                />
                <Col mx={12}>
                    <Text style={styles.sub1}>Casper</Text>
                    <Text style={styles.body2}>1.909,89 CSPR</Text>
                </Col>
            </Row>
            <Col.R mx={12}>
                <Text style={styles.sub1}>$32,128.80</Text>
                <Text style={styles.body2}>@ $189</Text>
            </Col.R>
        </Row.LR>
    );
};

export default TokenComponent;

const styles = StyleSheet.create({
    container: {
        height: scale(80),
        width: scale(343),
        alignItems: 'center',
        alignSelf: 'center',
        borderBottomWidth: scale(1),
        borderColor: colors.N5
    },
    symbol: {
        width: scale(40),
        height: scale(40),
    },
    sub1: {
        ...textStyles.Sub1,
    },
    body2: {
        ...textStyles.Body2,
        marginTop: scale(4)
    }
})
