import React, {useState, useRef, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

function HomeScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <Text>
                HomeScreen
            </Text>
        </View>
    );
}

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
    }
})
