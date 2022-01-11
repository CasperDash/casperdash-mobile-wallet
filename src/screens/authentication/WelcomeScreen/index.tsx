import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function WelcomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text>
                WelcomeScreen
            </Text>
        </View>
    );
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    }
})
