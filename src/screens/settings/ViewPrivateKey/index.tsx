import React, { useState } from 'react';
import { CButton } from 'components';
import CConfirmPinModal from 'components/CConfirmPinModal';
import MainRouter from 'navigation/stack/MainRouter';
import { IconEye } from 'assets';
import { useStackNavigation } from 'utils/hooks/useNavigation';

export const useViewPrivateKey = () => {
  const { navigate } = useStackNavigation();
  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);

  const onViewPrivateKey = () => {
    setShowConfirmPin(false);
    navigate(MainRouter.SHOW_PRIVATE_KEY_SCREEN);
  };
  const ViewPrivateKeyComp = () => {
    return (
      <>
        <CButton>
          <IconEye />
        </CButton>
        {showConfirmPin && (
          <CConfirmPinModal
            isShow={showConfirmPin}
            onConfirm={onViewPrivateKey}
            onCancel={() => setShowConfirmPin(false)}
          />
        )}
      </>
    );
  };
  return { setShowConfirmPin, ViewPrivateKeyComp };
};
