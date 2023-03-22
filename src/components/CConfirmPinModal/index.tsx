import React, { useState, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
// @ts-ignore
import SmoothPinCodeInput from 'react-native-smooth-pincode-input';
import Modal from 'react-native-modal';
import { scale } from 'device';
import { colors, IconCircleClose, textStyles, fonts } from 'assets';
import { Row, Col, CButton } from 'components';
import CTextButton from 'components/CTextButton';
import { PIN_LENGTH } from 'utils/constants/key';
import { validatePin } from 'utils/helpers/account';

interface CAlertProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  isShow?: boolean;
}

const CConfirmPinModal = ({ onCancel, onConfirm, isShow }: CAlertProps) => {
  const [pin, setPin] = useState<string>();
  const [error, setError] = useState<boolean>();
  const inputRef = useRef<any>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, []);

  const confirm = async () => {
    if (pin && pin.length === PIN_LENGTH) {
      const user = await validatePin(pin);
      if (user) {
        onConfirm?.();
      } else {
        setError(true);
      }
    } else if (error) {
      setError(false);
    }
  };
  return (
    <Modal
      style={styles.container}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={onCancel}
      backdropColor={'transparent'}
      isVisible={isShow}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
    >
      <Col style={styles.body}>
        <Row.R>
          <CButton onPress={onCancel}>
            <IconCircleClose width={scale(24)} height={scale(24)} />
          </CButton>
        </Row.R>
        <Col.C mt={8} mb={16}>
          <Text style={styles.title}>Enter security PIN</Text>
          <SmoothPinCodeInput
            placeholder={<View style={styles.pinPlaceholder} />}
            mask={<View style={[styles.pinPlaceholder, { backgroundColor: colors.R1 }]} />}
            maskDelay={500}
            password
            ref={inputRef}
            cellStyle={null}
            keyboardType={'number-pad'}
            autoFocus
            value={pin}
            codeLength={PIN_LENGTH}
            cellSpacing={0}
            restrictToNumbers
            cellStyleFocused={null}
            onTextChange={setPin}
            textStyle={styles.textStyle}
          />
          {error && <Text style={[styles.title, { color: colors.R1, marginTop: scale(20) }]}>Incorrect PIN code</Text>}
        </Col.C>
        <Row.LR>
          <CTextButton onPress={onCancel} text="Cancel" type={'line'} style={styles.button} variant="secondary" />
          <CTextButton onPress={confirm} text="Confirm" style={styles.button} disabled={pin?.length !== PIN_LENGTH} />
        </Row.LR>
      </Col>
    </Modal>
  );
};

export default CConfirmPinModal;

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
  },
  title: {
    ...textStyles.Body1,
    color: colors.c232635,
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  pinPlaceholder: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: colors.cFFFFFF,
    borderColor: colors.R1,
    borderWidth: scale(1),
  },
  textStyle: {
    color: colors.N1,
    fontSize: scale(20),
    fontFamily: fonts.Lato.regular,
  },
});
