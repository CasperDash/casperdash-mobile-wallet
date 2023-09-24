import React, { useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, Text } from 'react-native';
import { scale } from 'device';
import { colors, fonts } from 'assets';
import CAlert from 'components/CAlert';
import { useWatchUnvalidDomainWarning } from 'screens/browser/hooks/useWatchUnvalidDomainWarning';
import { getwebUrl } from 'utils/selectors';
import { useWebNavigate } from 'screens/browser/hooks/useWebNavigate';

const AutoNoticeDomainModal = () => {
  const alertRef = useRef<any>();
  const webUrl = useSelector(getwebUrl);
  const { goBack } = useWebNavigate();

  const { isValid } = useWatchUnvalidDomainWarning(webUrl);

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
    if (!isValid) {
      showWarningMessage();
    }
  }, [isValid, showWarningMessage]);

  return (
    <CAlert
      ref={alertRef}
      hideClose
      onConfirm={goBack}
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
