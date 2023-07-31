// Create sample react native template component
import React from 'react';

import { View, StyleSheet } from 'react-native';
import ListBrowserTabs from './ListBrowserTabs';
import Modal from 'react-native-modal';

type Props = {
  isVisible: boolean;
  onClose?: () => void;
};

const ModalBrowserTabs = ({ isVisible, onClose }: Props) => {
  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={() => onClose?.()}
      backdropColor={'rgba(252, 252, 253, 1)'}
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <View style={styles.container}>
        <ListBrowserTabs tabs={[]} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ModalBrowserTabs;
