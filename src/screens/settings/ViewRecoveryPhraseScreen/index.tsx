import React, { useState } from 'react';

import { useNavigation } from '@react-navigation/native';

import { IconEye } from 'assets';
import { CButton } from 'components';
import CConfirmPinModal from 'components/CConfirmPinModal';
import MainRouter from 'navigation/stack/MainRouter';

const ShowRecoveryPhrase = () => {
  const { navigate } = useNavigation();
  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);

  const onShowRecoveryPhrase = () => {
    setShowConfirmPin(false);
    navigate(MainRouter.SHOW_RECOVERY_PHRASE_SCREEN);
  };
  const showRecoveryPhraseComp = () => {
    return (
      <>
        <CButton>
          <IconEye />
        </CButton>
        {showConfirmPin && (
          <CConfirmPinModal
            isShow={showConfirmPin}
            onConfirm={onShowRecoveryPhrase}
            onCancel={() => setShowConfirmPin(false)}
          />
        )}
      </>
    );
  };
  return { setShowConfirmPin, ShowRecoveryPhrase: showRecoveryPhraseComp };
};

export default ShowRecoveryPhrase;
