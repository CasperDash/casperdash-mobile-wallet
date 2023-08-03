import React from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { useDispatch, useSelector } from 'react-redux';
import { allActions } from 'redux_manager';
import { getRequestMessage } from 'utils/selectors/browser';
import ConnectContent from './ConnectContent';
import SignContent from './SignContent';
import SignMessageContent from './SignMessageContent';
import { normalizeSignDeployParams, normalizeSignMessageParams } from 'screens/browser/utils/normalizer';
import { RequestMessage, RequestTypes } from 'redux_manager/browser/browser_reducer';

const ModalRequestAction = () => {
  const dispatch = useDispatch();
  const requestMessage: RequestMessage = useSelector(getRequestMessage);

  const handleOnClose = () => {
    dispatch(allActions.browser.clearRequestMessage());
  };

  const origin = requestMessage?.params?.origin;

  const renderContent = () => {
    switch (requestMessage.type) {
      case RequestTypes.CONNECT:
        return <ConnectContent url={origin} onClose={handleOnClose} />;
      case RequestTypes.SIGN:
        return <SignContent params={normalizeSignDeployParams(requestMessage.params)} onClose={handleOnClose} />;
      case RequestTypes.SIGN_MESSAGE:
        return (
          <SignMessageContent params={normalizeSignMessageParams(requestMessage.params)} onClose={handleOnClose} />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={handleOnClose}
      backdropColor={'rgba(252, 252, 253, 1)'}
      isVisible={!!requestMessage.type}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      style={styles.modal}
    >
      {requestMessage.type && <View style={styles.modalContainer}>{renderContent()}</View>}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  browser: {
    flex: 1,
  },
  modal: {
    backgroundColor: 'white',
    margin: 0, // This is the important style you need to set
    alignItems: undefined,
    justifyContent: undefined,
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    padding: 0,
    backgroundColor: 'white',
  },
  input: {},
});

export default ModalRequestAction;
