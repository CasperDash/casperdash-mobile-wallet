import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Row, Col, CButton} from 'components';
import {IconStatusReceive} from 'assets';
import {scale} from 'device';

function StakedInformationItem() {

    return (
        <CButton>
            <Row my={16} style={styles.container}>
                <IconStatusReceive width={scale(24)} height={scale(24)}/>
                <Text>
                    StakedIfomationItem
                </Text>
            </Row>
        </CButton>
    );
}

export default StakedInformationItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
});
