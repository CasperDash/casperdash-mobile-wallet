import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { scale } from 'device';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CButton, Col, Row } from 'components';
import { colors, textStyles, IconCloseFilledN4, IconScanCameraTimeout } from 'assets';

interface Props {
  onScanSuccess: (data: string) => void;
}

const ScanQrCodeModal = forwardRef(({ onScanSuccess }: Props, ref) => {
  useImperativeHandle(ref, () => ({
    open: openModal,
  }));

  const insets = useSafeAreaInsets();
  const modalRef = useRef<Modalize>(null);
  const [isCameraReady, setCameraReady] = useState<boolean>(false);

  const openModal = () => {
    modalRef.current?.open();
  };

  const closeModal = () => {
    modalRef.current?.close();
  };

  const onSuccess = (qrcode: any) => {
    if (qrcode && qrcode.data) {
      onScanSuccess && onScanSuccess(qrcode.data);
      closeModal();
    }
  };

  const onCameraReady = () => {
    if (!isCameraReady) {
      setCameraReady(true);
    }
  };

  const onModalClosed = () => {
    setCameraReady(false);
  };

  const _renderHeader = () => {
    return (
      <Row.C pt={32} pb={12} style={styles.headerContainer}>
        <Text style={textStyles.H6}>Scan QR Code</Text>
        <CButton onPress={closeModal} style={styles.btnClose}>
          <IconCloseFilledN4 width={scale(27)} height={scale(27)} />
        </CButton>
      </Row.C>
    );
  };

  return (
    <Modalize
      ref={modalRef}
      onClosed={onModalClosed}
      modalStyle={{
        borderTopLeftRadius: scale(40),
        borderTopRightRadius: scale(40),
      }}
      modalTopOffset={scale(120)}
      scrollViewProps={{
        stickyHeaderIndices: [0],
        showsVerticalScrollIndicator: false,
        contentContainerStyle: {
          paddingBottom: insets.bottom,
        },
      }}
    >
      {_renderHeader()}
      <Col mt={48}>
        {/* <QRCodeScanner
          reactivate
          reactivateTimeout={1000}
          onRead={onSuccess}
          cameraProps={{
            onCameraReady: onCameraReady,
          }}
          cameraStyle={styles.cameraContainer}
          flashMode={RNCamera.Constants.FlashMode.auto}
          bottomContent={
            <Text style={styles.txtDescription}>
              You can only scan your QR from this page. To view your QR please select the icon on your account
            </Text>
          }
        /> */}
        {!isCameraReady && (
          <IconScanCameraTimeout width={scale(160)} height={scale(160)} style={styles.cameraTimeout} />
        )}
      </Col>
    </Modalize>
  );
});

export default ScanQrCodeModal;

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomColor: colors.N5,
    borderBottomWidth: scale(1),
    width: scale(343),
    alignSelf: 'center',
    backgroundColor: colors.W1,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
  },
  btnClose: {
    position: 'absolute',
    right: 0,
    top: scale(26),
  },
  txtDescription: {
    ...textStyles.Body2,
    color: colors.N3,
    paddingHorizontal: scale(24),
    textAlign: 'center',
    lineHeight: scale(24),
    marginTop: scale(26),
  },
  cameraContainer: {
    width: scale(160),
    height: scale(160),
    borderRadius: scale(24),
    overflow: 'hidden',
    alignSelf: 'center',
  },
  cameraTimeout: {
    position: 'absolute',
    alignSelf: 'center',
  },
});
