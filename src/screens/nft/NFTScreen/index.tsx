import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function NFTScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text>
                NFTScreen
            </Text>
        </View>
    );
}

export default NFTScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    }
})
