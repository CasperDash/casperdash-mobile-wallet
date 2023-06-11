import React, { useCallback } from 'react';
import { SafeAreaView, Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { colors, images } from 'assets';
import Icon from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import { scale } from 'device';

const styles = StyleSheet.create({
  modal: {
    margin: 0,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.B1,
  },
  preview: {
    flex: 1,
  },
  innerView: {
    flex: 1,
  },
  closeIcon: {
    marginTop: scale(20),
    marginRight: scale(20),
    width: scale(40),
    alignSelf: 'flex-end',
  },
  frame: {
    width: scale(250),
    height: scale(250),
    alignSelf: 'center',
    justifyContent: 'center',
    marginTop: scale(100),
    opacity: 0.5,
  },
  text: {
    flex: 1,
    fontSize: scale(17),
    color: colors.W1,
    textAlign: 'center',
    justifyContent: 'center',
    marginTop: scale(100),
  },
  hint: {
    backgroundColor: colors.W1,
    width: '100%',
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintText: {
    width: scale(240),
    maxWidth: '80%',
    color: colors.B1,
    textAlign: 'center',
    fontSize: scale(16),
  },
  bold: {
    fontWeight: 'bold',
  },
});

interface QRScannerProps {
  visible: boolean;
  onScanSuccess: (data: string) => void;
  onScanError: (error: string) => void;
  hideModal: () => void;
}

const QRScanner = (props: QRScannerProps) => {
  const { visible, onScanError, onScanSuccess, hideModal } = props;

  const onError = useCallback(
    (error) => {
      if (onScanError && error) {
        onScanError(error.message);
      }
    },
    [onScanError],
  );

  const onBarCodeRead = useCallback(
    (response) => {
      if (!response.data) {
        return;
      }
      try {
        const content = response.data;
        onScanSuccess && onScanSuccess(content);
        hideModal();
      } catch (e) {
        onScanError('Invalid QR code');
      }
    },
    [onScanSuccess, onScanError, hideModal],
  );

  const onStatusChange = useCallback(
    (event) => {
      if (event.cameraStatus === 'NOT_AUTHORIZED') {
        onScanError('Camera permission not granted');
      }
    },
    [onScanError],
  );

  return (
    <Modal isVisible={visible} style={styles.modal}>
      <View style={styles.container}>
        <RNCamera
          onMountError={onError}
          captureAudio={false}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          onBarCodeRead={onBarCodeRead}
          flashMode={RNCamera.Constants.FlashMode.auto}
          androidCameraPermissionOptions={{
            title: 'Allow camera access',
            message: 'We need your permission to scan QR codes',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onStatusChange={onStatusChange}
        >
          <SafeAreaView style={styles.innerView}>
            <TouchableOpacity style={styles.closeIcon} onPress={hideModal}>
              <Icon name={'ios-close'} size={50} color={'white'} />
            </TouchableOpacity>
            <Image source={images.frame} style={styles.frame} />
            <Text style={styles.text}>{'scanning...'}</Text>
          </SafeAreaView>
        </RNCamera>
        <View style={styles.hint}>
          <Text>Scan casper wallet address</Text>
        </View>
      </View>
    </Modal>
  );
};

export default QRScanner;
