import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Row, Col, CButton} from 'components';
import {colors, IconStatusReceive, textStyles} from 'assets';
import {scale} from 'device';

interface Props {
    onPress: (deploy: any) => void,
    value: any,
}

const TransactionItem = ({onPress, value}: Props) => {
    return (
        <CButton onPress={() => onPress(value)}>
            <Row px={16} py={10} style={styles.container}>
                <IconStatusReceive width={scale(24)} height={scale(24)}/>
                <Row.LR pl={16} style={{flex: 1}}>
                    <Col.L>
                        <Text style={textStyles.Sub1}>0xa64784...2583</Text>
                        <Text style={[textStyles.Body2, {color: colors.c828489, marginTop: scale(4)}]}>2021-11-09 23:45</Text>
                    </Col.L>
                    <Col.R>
                        <Text style={textStyles.Sub1}>+0.00274 CSPR</Text>
                        <Text style={[textStyles.Body2, {color: colors.c828489, marginTop: scale(4)}]}>Pending</Text>
                    </Col.R>
                </Row.LR>
            </Row>
        </CButton>
    );
};

export default TransactionItem;

const styles = StyleSheet.create({
    container: {
        width: scale(375),
        alignItems: 'center',
    },
});
