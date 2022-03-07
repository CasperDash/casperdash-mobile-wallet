import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function MarketScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text>
                MarketScreen
            </Text>
        </View>
    );
}

export default MarketScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    }
})
