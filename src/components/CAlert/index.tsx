import React, { CSSProperties, forwardRef, useImperativeHandle, useState } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'device';
import { colors, IconCircleClose, textStyles } from 'assets';
import { Row, Col, CButton } from 'components';
import CTextButton from 'components/CTextButton';

interface AlertType {
  alertMessage: string | Text;
  buttonLeft?: string;
  buttonRight?: string;
  showConfirm?: boolean;
  showCancel?: boolean;
  onConfirm?: () => void;
}

interface CAlertProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  hideClose?: boolean;
  buttonConfirmStyle?: CSSProperties;
  buttonCancelStyle?: CSSProperties;
  hideOnClickOutside?: boolean;
  backdropColor?: string;
}

const defaultAlertType = {
  alertMessage: '',
  buttonLeft: 'Cancel',
  buttonRight: 'Confirm',
  showConfirm: true,
  showCancel: true,
};

const CAlert = forwardRef(
  (
    {
      onCancel,
      onConfirm,
      hideClose = false,
      buttonConfirmStyle,
      buttonCancelStyle,
      hideOnClickOutside = true,
      backdropColor = 'rgba(252, 252, 253, 1)',
    }: CAlertProps,
    ref,
  ) => {
    const [isVisible, setVisible] = useState<boolean>(false);
    const [alert, setAlert] = useState<AlertType>(defaultAlertType);

    useImperativeHandle(ref, () => ({
      show: show,
      hide: hide,
    }));

    const show = (data: AlertType) => {
      setVisible(true);
      setAlert({ ...alert, ...data });
    };

    const hide = () => {
      setVisible(false);
    };

    const cancel = () => {
      hide();
      onCancel && onCancel();
    };

    const confirm = () => {
      hide();
      if (alert.onConfirm) {
        alert.onConfirm();
      } else if (onConfirm) {
        onConfirm();
      }
    };

    return (
      <Modal
        style={styles.container}
        useNativeDriver={true}
        hideModalContentWhileAnimating
        coverScreen={true}
        onBackdropPress={hideOnClickOutside ? hide : undefined}
        backdropColor={backdropColor || 'transparent'}
        isVisible={isVisible}
        animationIn={'fadeIn'}
        animationOut={'fadeOut'}
      >
        <Col style={styles.body}>
          {!hideClose && (
            <Row.R>
              <CButton onPress={hide}>
                <IconCircleClose width={scale(24)} height={scale(24)} />
              </CButton>
            </Row.R>
          )}
          {typeof alert.alertMessage === 'string' ? (
            <Text style={styles.message}>{alert.alertMessage}</Text>
          ) : (
            <>{alert.alertMessage}</>
          )}
          <Row.LR style={styles.actions}>
            {alert.showCancel && (
              <CTextButton
                onPress={cancel}
                text={alert.buttonLeft}
                type={'line'}
                style={[styles.button, buttonCancelStyle]}
                variant="secondary"
              />
            )}
            {alert.showConfirm && (
              <CTextButton onPress={confirm} text={alert.buttonRight} style={[styles.button, buttonConfirmStyle]} />
            )}
          </Row.LR>
        </Col>
      </Modal>
    );
  },
);

export default CAlert;

const styles = StyleSheet.create({
  container: {
    margin: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: scale(320),
    minHeight: scale(223),
    backgroundColor: colors.W1,
    borderRadius: scale(16),
    padding: scale(16),

    shadowColor: Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: scale(16),
    shadowOpacity: 0.6,

    elevation: 10,
  },
  message: {
    ...textStyles.Body1,
    marginVertical: scale(32),
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    lineHeight: 30,
  },
  button: {
    width: scale(136),
    height: scale(40),
  },
  actions: { justifyContent: 'space-between' },
});
