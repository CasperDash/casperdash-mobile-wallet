import React from 'react';
import { StyleSheet, View } from 'react-native';

const BrowserTab = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageWrapper} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageWrapper: {},
});

export default BrowserTab;
