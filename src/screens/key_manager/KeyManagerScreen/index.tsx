import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function KeyManagerScreen() {
  return (
    <View style={styles.container}>
      <Text>KeyManagerScreen</Text>
    </View>
  );
}

export default KeyManagerScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
});
