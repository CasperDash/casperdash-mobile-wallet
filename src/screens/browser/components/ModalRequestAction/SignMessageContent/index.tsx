import { colors, textStyles } from 'assets';
import { CButton } from 'components';
import { scale } from 'device';
import _ from 'lodash';
import React, { useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RequestTypes } from 'redux_manager/browser/browser_reducer';
import BrowserContext from 'screens/browser/context';
import { RepliedTypes } from 'screens/browser/enums/repliedTypes';
import { useConnectedSite } from 'screens/browser/hooks/useConnectedSite';
import { SignMessageParams } from 'screens/browser/types/signing';
import { buildEventSender, buildRawSender } from 'screens/browser/utils/jsInjector';
import { useSignerWithWallet } from 'utils/hooks/useSignerWithUid';
import { getPublicKey } from 'utils/selectors';

type Props = {
  onClose?: () => void;
  params: SignMessageParams;
};
const SignMessageContent = ({ onClose, params }: Props) => {
  const publicKey = useSelector(getPublicKey);
  const browserRef = useContext(BrowserContext);
  const { connectedSite } = useConnectedSite();
  const signer = useSignerWithWallet(connectedSite?.account?.walletInfo);

  const handleOnApprove = async () => {
    if (!browserRef.current) return;

    const signedMessage = await signer.signMessage(params.message);
    const jsScript = buildRawSender(RequestTypes.SIGN_MESSAGE, `'${signedMessage}'`);

    browserRef.current.injectJavaScript(jsScript);

    onClose?.();
  };

  const handleOnReject = () => {
    if (!browserRef.current) return;

    browserRef.current.injectJavaScript(buildEventSender(RepliedTypes.REJECTED_SIGN, { publicKey }));

    onClose?.();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={textStyles.H5}>Sign Message</Text>
      </View>
      <View style={styles.body}>
        <ScrollView>
          <View>
            <Text style={styles.caption}>
              Public Key ({_.get(connectedSite, 'account.walletInfo.descriptor.name', 'Unknown')})
            </Text>
            <Text style={styles.value}>{connectedSite?.account?.publicKey}</Text>
          </View>
          <View>
            <Text style={styles.caption}>Message</Text>
            <Text style={styles.value}>{params.message}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <CButton onPress={handleOnApprove} style={[styles.button, styles.buttonPrimary]}>
          <Text>Approve</Text>
        </CButton>
        <CButton onPress={handleOnReject} style={[styles.button, styles.buttonOutline]}>
          <Text>Reject</Text>
        </CButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    flexDirection: 'column',
    gap: scale(20),
    justifyContent: 'space-between',
    paddingVertical: scale(40),
  },
  caption: {
    ...textStyles.Sub2,
    color: colors.N3,
  },
  value: {
    ...textStyles.Sub2,
    color: colors.N2,
    marginTop: scale(5),
    marginBottom: scale(16),
  },
  header: {
    marginTop: scale(20),
    alignItems: 'center',
  },
  body: {
    padding: scale(20),
    flex: 1,
  },
  footer: {
    flexBasis: scale(40),
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: scale(140),
    height: scale(40),
    borderRadius: scale(90),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: colors.R1,
  },
  buttonOutline: {
    borderRadius: scale(90),
    borderWidth: scale(1),
    borderColor: colors.c000000,
  },
});
export default SignMessageContent;
