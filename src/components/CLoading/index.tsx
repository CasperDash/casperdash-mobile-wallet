import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

import Modal from 'react-native-modal';

export default function Index() {
  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      isVisible={true}
    >
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
