import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function StakingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <Text>StakingScreen</Text>
    </View>
  );
}

export default StakingScreen;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
  },
});
