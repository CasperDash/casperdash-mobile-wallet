import React from 'react';
import { scale } from 'device';
import { IconBlock, colors } from 'assets';
import { useNavigateSimpleWebView } from 'utils/hooks/useNavigateSimpleWebView';
import config from 'utils/config';
import CTextButton from 'components/CTextButton';

type Props = {
  publicKey: string;
  onPress?: () => void;
};

const ViewAccountOnExplorer = ({ publicKey, onPress }: Props) => {
  const { navigateToWebView } = useNavigateSimpleWebView();

  const handleOnPress = () => {
    onPress?.();
    navigateToWebView({
      url: config.getViewExplorerURL('account', publicKey),
      title: 'Account on explorer',
    });
  };

  return (
    <CTextButton
      type="line"
      textStyle={{ color: colors.N2 }}
      onPress={handleOnPress}
      icon={<IconBlock width={scale(17)} height={scale(17)} />}
      text="View Account On Explorer"
      style={{ borderColor: colors.N4 }}
    />
  );
};

export default ViewAccountOnExplorer;
