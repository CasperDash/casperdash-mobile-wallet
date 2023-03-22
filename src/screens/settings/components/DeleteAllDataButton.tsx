import React, { useRef, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, textStyles, fonts } from 'assets';
import { CAlert, CButton } from 'components';
import { scale } from 'device';
import AuthenticationRouter from 'navigation/AuthenticationNavigation/AuthenticationRouter';
import { Config, Keys } from 'utils';
import { useDispatch } from 'react-redux';
import { allActions } from 'redux_manager';
import CConfirmPinModal from 'components/CConfirmPinModal';
import { useRestack } from 'utils/hooks/useRestack';
import { StackName } from 'navigation/ScreenProps';

const DeleteAllDataButton = () => {
  const alertRef = useRef<any>();
  const dispatch = useDispatch();
  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);
  const reStack = useRestack();

  const onPressNext = () => {
    alertRef.current.hide();
    setShowConfirmPin(true);
  };

  const onDeleteAllData = () => {
    const alert = {
      buttonRight: 'Next',
      alertMessage: (
        <>
          <Text style={styles.deleteQuestion}>Are you sure you want to delete your wallet ?</Text>
          <Text style={styles.deleteMessage}>
            Your current wallet, accounts and assets will be removed from this app permanently. This action cannot be
            undone.
          </Text>
          <Text style={styles.deleteMessage}>
            Your can ONLY recover this wallet with your Secret Recovery Phase CasperDash does not have your Secret
            Recovery Phase.
          </Text>
        </>
      ),
    };
    alertRef.current.show(alert);
  };

  const deleteAllData = () => {
    Promise.all(
      Object.entries(Keys).map((key) => {
        return Config.deleteItem(key[1]);
      }),
    ).then(async () => {
      dispatch(allActions.main.clearAllData());
      setShowConfirmPin(false);
      resetStack(AuthenticationRouter.CREATE_NEW_WALLET);
    });
  };

  const resetStack = (name: string) => {
    reStack(StackName.AuthenticationStack, name);
  };

  return (
    <>
      <CButton onPress={onDeleteAllData} style={styles.btnDelete}>
        <Text style={styles.txtDelete}>Delete All Data</Text>
      </CButton>

      {!showConfirmPin ? (
        <CAlert ref={alertRef} onConfirm={onPressNext} />
      ) : (
        <CConfirmPinModal isShow={showConfirmPin} onConfirm={deleteAllData} onCancel={() => setShowConfirmPin(false)} />
      )}
    </>
  );
};

export default DeleteAllDataButton;

const styles = StyleSheet.create({
  btnDelete: {
    paddingVertical: scale(6),
    paddingHorizontal: scale(16),
    minWidth: scale(134),
    height: scale(36),
    borderRadius: scale(18),
    borderWidth: scale(1),
    borderColor: colors.N4,
    alignSelf: 'center',
    marginTop: scale(70),
  },
  txtDelete: {
    ...textStyles.Body2,
  },
  messageContainer: {
    flex: 1,
    alignItems: 'center',
    textAlign: 'center',
  },
  deleteMessage: {
    textAlign: 'center',
    fontSize: scale(16),
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
  deleteQuestion: {
    color: colors.R1,
    fontWeight: '800',
    fontSize: scale(20),
    textAlign: 'center',
    marginBottom: scale(20),
  },
});
