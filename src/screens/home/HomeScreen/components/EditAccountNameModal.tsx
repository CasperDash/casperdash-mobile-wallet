import React, { useState, useEffect, useRef } from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
// @ts-ignore
import Modal from 'react-native-modal';
import { scale } from 'device';
import { colors, IconCircleClose, textStyles, fonts } from 'assets';
import { Row, Col, CButton } from 'components';
import CTextButton from 'components/CTextButton';
import CInput from 'components/CInput';

interface IEditAccountNameModalProps {
  onCancel?: () => void;
  onConfirm?: (name: string) => void;
  isShow?: boolean;
  currentName: string;
}

const EditAccountNameModal = ({ onCancel, onConfirm, isShow, currentName }: IEditAccountNameModalProps) => {
  const [name, setName] = useState<string>(currentName);
  const inputRef = useRef<any>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 1000);
    }
  }, []);

  const confirm = async () => {
    onConfirm?.(name);
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
          <Text style={styles.title}>Enter new name</Text>
          <CInput value={name} onChangeText={(text) => setName(text)} style={{ width: scale(200) }} />
        </Col.C>
        <Row.LR>
          <CTextButton onPress={onCancel} text="Cancel" type={'line'} style={styles.button} variant="secondary" />
          <CTextButton onPress={confirm} text="Confirm" style={styles.button} disabled={!name?.length} />
        </Row.LR>
      </Col>
    </Modal>
  );
};

export default EditAccountNameModal;

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
