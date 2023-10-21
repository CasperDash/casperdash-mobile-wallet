import React, { useCallback, useEffect, useRef } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { StyleSheet, Text } from 'react-native';
import { scale } from 'device';
import { colors, fonts } from 'assets';
import CAlert from 'components/CAlert';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';
import { getIsShowWarningDomain } from 'utils/selectors/browser';
import { allActions } from 'redux_manager';

type Props = {
  isCanBack?: boolean;
};

const AutoNoticeDomainModal = ({ isCanBack }: Props) => {
  const alertRef = useRef<any>();
  const isShowWarning = useSelector(getIsShowWarningDomain);
  const { goBack } = useWebNavigate();
  const dispatch = useDispatch();

  const showWarningMessage = useCallback(() => {
    const alert = {
      buttonRight: 'Back',
      buttonLeft: 'Keep',
      alertMessage: (
        <>
          <Text style={styles.title}>Are you sure you want to access this domain ?</Text>
          <Text style={styles.message}>
            This domain is not verified by Safe Browser. You can still continue to access this domain, but you should
            proceed with caution.
          </Text>
        </>
      ),
    };
    alertRef.current.show(alert);
  }, []);

  useEffect(() => {
    if (isShowWarning) {
      showWarningMessage();
    }
  }, [isShowWarning, showWarningMessage]);

  const handleGoBack = () => {
    if (isCanBack) {
      goBack();
      dispatch(allActions.browser.setIsShowWarningDomain(false));
    } else {
      batch(() => {
        dispatch(allActions.browser.updatewebUrl(''));
        dispatch(allActions.browser.setLoadingProgress(0));
        dispatch(allActions.browser.setDisplayType('homepage'));
        dispatch(allActions.browser.setIsShowWarningDomain(false));
      });
    }
  };

  const handleOnCancel = () => {
    dispatch(allActions.browser.setIsShowWarningDomain(false));
    alertRef.current.hide();
  };

  return (
    <CAlert
      ref={alertRef}
      hideClose
      onConfirm={handleGoBack}
      onCancel={handleOnCancel}
      buttonConfirmStyle={styles.confirmButton}
      buttonCancelStyle={{ width: scale(100) }}
      hideOnClickOutside={false}
    />
  );
};

export default AutoNoticeDomainModal;

const styles = StyleSheet.create({
  confirmButton: { width: 'auto', alignSelf: 'center' },
  title: {
    color: colors.R1,
    fontWeight: '800',
    fontSize: scale(20),
    textAlign: 'center',
    marginBottom: scale(20),
  },
  message: {
    textAlign: 'center',
    fontSize: scale(16),
    marginBottom: scale(20),
    fontFamily: fonts.Lato.regular,
  },
});
