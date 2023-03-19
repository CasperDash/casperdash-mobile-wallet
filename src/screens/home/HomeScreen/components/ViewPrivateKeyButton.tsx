import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { CButton, Row } from 'components';
import { scale } from 'device';
import { textStyles, IconKey } from 'assets';
import { useNavigation } from '@react-navigation/native';
import CConfirmPinModal from 'components/CConfirmPinModal';
import MainRouter from 'navigation/stack/MainRouter';

interface IProps {
  onConfirm: () => void;
}

const ViewPrivateKeyButton = ({ onConfirm }: IProps) => {
  const { navigate } = useNavigation();

  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);

  const onShowPrivateKey = () => {
    onConfirm();
    navigate(MainRouter.SHOW_PRIVATE_KEY_SCREEN);
  };

  return (
    <>
      <CButton onPress={() => setShowConfirmPin(true)}>
        <Row style={styles.rowItem}>
          <IconKey width={scale(17)} height={scale(17)} />
          <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>View Private Key</Text>
        </Row>
      </CButton>
      {showConfirmPin && (
        <CConfirmPinModal
          isShow={showConfirmPin}
          onConfirm={onShowPrivateKey}
          onCancel={() => setShowConfirmPin(false)}
        />
      )}
    </>
  );
};

export default ViewPrivateKeyButton;

const styles = StyleSheet.create({
  rowItem: {
    alignItems: 'center',
    minHeight: scale(40),
  },
});
