import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import Modal from 'react-native-modal';
import { scale } from 'device';
import {
  colors,
  IconCircleClose,
  textStyles,
  IconPlusCircle,
  IconImportAccount,
} from 'assets';
import { CButton, Col, Row } from 'components';
import AccountItem from 'screens/home/HomeScreen/components/AccountItem';

const SelectAccountModal = forwardRef(({ onCancel, onConfirm }: any, ref) => {
  const [isVisible, setVisible] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    show: show,
  }));

  const show = () => {
    setVisible(true);
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
    onConfirm && onConfirm();
  };

  return (
    <Modal
      style={styles.container}
      useNativeDriver={true}
      hideModalContentWhileAnimating
      coverScreen={true}
      onBackdropPress={hide}
      backdropColor={'rgba(252, 252, 253, 1)'}
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}>
      <Col style={styles.body}>
        <Row.R>
          <CButton onPress={hide}>
            <IconCircleClose width={scale(24)} height={scale(24)} />
          </CButton>
        </Row.R>
        <Col mb={12} style={styles.accountContainer}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: scale(220) }}
            contentContainerStyle={{ paddingVertical: scale(10) }}>
            <AccountItem isCurrentAccount={true} />
            <AccountItem isCurrentAccount={false} />
          </ScrollView>
        </Col>
        <CButton>
          <Row style={styles.rowItem}>
            <IconPlusCircle width={scale(17)} height={scale(17)} />
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>
              Create New Account
            </Text>
          </Row>
        </CButton>
        <CButton>
          <Row style={styles.rowItem}>
            <IconImportAccount width={scale(17)} height={scale(17)} />
            <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>
              Import Account
            </Text>
          </Row>
        </CButton>
      </Col>
    </Modal>
  );
});

export default SelectAccountModal;

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
    padding: scale(24),
    paddingBottom: scale(14),
    shadowColor:
      Platform.OS === 'ios' ? 'rgba(35, 38, 53, 0.2)' : 'rgba(35, 38, 53, 0.6)',
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
    height: scale(48),
  },
  accountContainer: {
    borderBottomWidth: scale(1),
    borderBottomColor: colors.N5,
  },
  rowItem: {
    alignItems: 'center',
    minHeight: scale(40),
  },
});
