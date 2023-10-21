import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { CButton, Col } from 'components';
import { scale } from 'device';
import { colors, textStyles, IconBuy } from 'assets';
import RampSdk from '@ramp-network/react-native-sdk';
import { useSelector } from 'react-redux';
import { getPublicKey } from 'utils/selectors';
import APP_CONFIGS from 'utils/config/index';

export const BuyButton = () => {
  const ramp = new RampSdk();

  const publicKey = useSelector(getPublicKey);

  return (
    <Col mx={16} mb={16} style={styles.container}>
      <CButton
        style={styles.button}
        onPress={() =>
          ramp.show({
            hostAppName: 'CasperDash',
            hostLogoUrl:
              'https://github.com/CasperDash/casperdash-materials/blob/3b92dd04768a96946e054548c12d9281e56b17d4/media-kit/rw-lg.png?raw=true',
            hostApiKey: APP_CONFIGS.RAMP_API_KEY || '6t8ty5y2jvbyam46v5d7g6pdx3hnkhhs5sg4gxd2',
            userAddress: publicKey,
            swapAsset: 'CASPER_CSPR',
          })
        }
      >
        <IconBuy style={{ width: scale(24), height: scale(24), fill: '#FA2852' }} />
      </CButton>
      <Text style={styles.title}>Buy</Text>
    </Col>
  );
};

export default BuyButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    width: scale(52),
    height: scale(52),
    borderRadius: scale(26),
    backgroundColor: colors.R2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...textStyles.Body2,
    color: colors.N3,
    marginTop: scale(12),
  },
});
