import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function StakedIfomationItem() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text>
            StakedIfomationItem
            </Text>
        </View>
    );
}

export default StakedIfomationItem;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    }
})
