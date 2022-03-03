import React, { useState, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function ValidatorItem() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Text>ValidatorItem</Text>
    </View>
  );
}

export default ValidatorItem;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
});
