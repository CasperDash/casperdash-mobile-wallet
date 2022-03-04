import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Row, Col} from 'components';

function StakedInfomationItem() {
    const insets = useSafeAreaInsets();

    return (
        <Row my={16} style={styles.container}>
            <Text>
                StakedIfomationItem
            </Text>
        </Row>
    );
}

export default StakedInfomationItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
});
