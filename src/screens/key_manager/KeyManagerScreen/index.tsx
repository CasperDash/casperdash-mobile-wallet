import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function KeyManagerScreen() {
  const insets = useSafeAreaInsets();

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
