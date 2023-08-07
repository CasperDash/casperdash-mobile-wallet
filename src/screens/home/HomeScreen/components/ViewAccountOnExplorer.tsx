import React from 'react';
import { Text, StyleSheet } from 'react-native';

import { textStyles, IconBlock } from 'assets';
import { CButton, Row } from 'components';
import { scale } from 'device';
import config from 'utils/config';
import { useNavigateSimpleWebView } from 'utils/hooks/useNavigateSimpleWebView';

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
    <CButton onPress={handleOnPress}>
      <Row style={styles.rowItem}>
        <IconBlock width={scale(17)} height={scale(17)} />
        <Text style={[textStyles.Sub1, { marginLeft: scale(16) }]}>View Account On Explorer</Text>
      </Row>
    </CButton>
  );
};

export default ViewAccountOnExplorer;

const styles = StyleSheet.create({
  rowItem: {
    alignItems: 'center',
    minHeight: scale(40),
  },
});
