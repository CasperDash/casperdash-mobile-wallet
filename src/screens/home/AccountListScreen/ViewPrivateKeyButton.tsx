import React, { useState } from 'react';
import { scale } from 'device';
import { IconKey, colors } from 'assets';
import CConfirmPinModal from 'components/CConfirmPinModal';
import MainRouter from 'navigation/stack/MainRouter';
import { useStackNavigation } from 'utils/hooks/useNavigation';
import CTextButton from 'components/CTextButton';

interface IProps {
  onConfirm: () => void;
  style: any;
}

const ViewPrivateKeyButton = ({ onConfirm, style }: IProps) => {
  const { navigate } = useStackNavigation();

  const [showConfirmPin, setShowConfirmPin] = useState<boolean>(false);

  const onShowPrivateKey = () => {
    onConfirm();
    navigate(MainRouter.SHOW_PRIVATE_KEY_SCREEN);
  };

  return (
    <>
      <CTextButton
        type="line"
        textStyle={{ color: colors.N2 }}
        onPress={() => setShowConfirmPin(true)}
        icon={<IconKey width={scale(17)} height={scale(17)} />}
        text="View Private Key"
        style={style}
      />

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
