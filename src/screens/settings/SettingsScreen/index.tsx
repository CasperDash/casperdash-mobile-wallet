import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function SettingsScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text>
                SettingsScreen
            </Text>
        </View>
    );
}

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    }
})
